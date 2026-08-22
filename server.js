const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const childProcess = require("child_process");
const app = express();


// ============================
// KONFIGURASI
// ============================

const PORT = 3000;

const DATABASE_DIR =
    path.join(__dirname, "database");

const FILE =
    path.join(DATABASE_DIR, "artikel.json");

const UPLOAD_DIR =
    path.join(__dirname, "public", "uploads");
const DOCS_UPLOAD_DIR =
    path.join(
        __dirname,
        "docs",
        "uploads"
    );

// ============================
// BUAT FOLDER
// ============================

if (!fs.existsSync(DATABASE_DIR)) {

    fs.mkdirSync(
        DATABASE_DIR,
        { recursive: true }
    );

}


if (!fs.existsSync(UPLOAD_DIR)) {

    fs.mkdirSync(
        UPLOAD_DIR,
        { recursive: true }
    );

}
if (!fs.existsSync(DOCS_UPLOAD_DIR)) {

    fs.mkdirSync(
        DOCS_UPLOAD_DIR,
        { recursive: true }
    );

}

if (!fs.existsSync(FILE)) {

    fs.writeFileSync(
        FILE,
        "[]",
        "utf8"
    );

}


// ============================
// MIDDLEWARE
// ============================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// ============================
// MULTER
// ============================

const storage =
    multer.diskStorage({

        destination:
            function (
                req,
                file,
                cb
            ) {

                cb(
                    null,
                    UPLOAD_DIR
                );

            },


        filename:
            function (
                req,
                file,
                cb
            ) {

                const ext =
                    path.extname(
                        file.originalname
                    );

                const nama =
                    "gambar-" +
                    Date.now() +
                    ext;

                cb(
                    null,
                    nama
                );

            }

    });


const upload =
    multer({

        storage: storage,

        limits: {

            fileSize:
                5 * 1024 * 1024

        },

        fileFilter:
            function (
                req,
                file,
                cb
            ) {

                const allowed = [
                    ".jpg",
                    ".jpeg",
                    ".png",
                    ".gif",
                    ".webp"
                ];

                const ext =
                    path
                        .extname(
                            file.originalname
                        )
                        .toLowerCase();


                if (
                    allowed.includes(ext)
                ) {

                    cb(
                        null,
                        true
                    );

                } else {

                    cb(
                        new Error(
                            "Format gambar tidak didukung."
                        )
                    );

                }

            }

    });


// ============================
// DATABASE
// ============================

function bacaArtikel() {

    try {

        return JSON.parse(
            fs.readFileSync(
                FILE,
                "utf8"
            )
        );

    } catch (error) {

        return [];

    }

}


function simpanArtikel(data) {

    fs.writeFileSync(
        FILE,
        JSON.stringify(
            data,
            null,
            2
        ),
        "utf8"
    );

}
function sinkronkanGitHubPages() {

    try {

        const docsArtikel =
            path.join(
                __dirname,
                "docs",
                "artikel.json"
            );

        const docsUploads =
            path.join(
                __dirname,
                "docs",
                "uploads"
            );

        // Buat folder docs/uploads jika belum ada
        if (!fs.existsSync(docsUploads)) {

            fs.mkdirSync(
                docsUploads,
                { recursive: true }
            );

        }

        // Salin database artikel ke docs
        fs.copyFileSync(
            FILE,
            docsArtikel
        );

        // Jalankan generator halaman SEO
        childProcess.execFileSync(
            process.execPath,
            [
                path.join(
                    __dirname,
                    "tools",
                    "generate-pages.js"
                )
            ],
            {
                stdio: "inherit"
            }
        );

        console.log(
            "GitHub Pages berhasil diperbarui."
        );

    } catch (error) {

        console.error(
            "Gagal memperbarui GitHub Pages:",
            error.message
        );

    }

}

// ============================
// GET ARTIKEL
// ============================

app.get(
    "/api/artikel",
    function (
        req,
        res
    ) {

        const data =
            bacaArtikel();

        res.json(data);

    }
);


// ============================
// TAMBAH ARTIKEL
// ============================
function buatSlug(teks) {

    return teks
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

}
app.post(
    "/api/artikel",
    function (
        req,
        res
    ) {

        const data =
            bacaArtikel();


            const artikel = {

                id:
                    Date.now(),
            
                judul:
                    req.body.judul,
            
                slug:
                    buatSlug(req.body.judul),
            
                kategori:
                    req.body.kategori || "Umum",
            
                gambar:
                    req.body.gambar || "",
            
                isi:
                    req.body.isi,
            
                tanggal:
                    new Date().toISOString()
            
            };


        data.push(
            artikel
        );


        simpanArtikel(
            data
        );
        
        sinkronkanGitHubPages();
        
        res.json({

            status:
                "berhasil",

            artikel:
                artikel

        });

    }
);


// ============================
// UPLOAD GAMBAR
// ============================

app.post(
    "/api/upload",
    upload.single("gambar"),
    function (
        req,
        res
    ) {

        if (!req.file) {

            return res
                .status(400)
                .json({

                    status:
                        "gagal",

                    pesan:
                        "Tidak ada gambar."

                });

        }


        const url =
            "/uploads/" +
            req.file.filename;
            const sumberGambar =
            path.join(
                UPLOAD_DIR,
                req.file.filename
            );
        
        const tujuanGambar =
            path.join(
                DOCS_UPLOAD_DIR,
                req.file.filename
            );
        
        fs.copyFileSync(
            sumberGambar,
            tujuanGambar
        );

        res.json({

            status:
                "berhasil",

            url:
                url

        });

    }
);


// ============================
// EDIT ARTIKEL
// ============================

app.put(
    "/api/artikel/:id",
    function (
        req,
        res
    ) {

        const data =
            bacaArtikel();


        const id =
            Number(
                req.params.id
            );


        const index =
            data.findIndex(
                function (a) {

                    return a.id === id;

                }
            );


        if (index === -1) {

            return res
                .status(404)
                .json({

                    status:
                        "gagal",

                    pesan:
                        "Artikel tidak ditemukan."

                });

        }


        data[index].judul =
            req.body.judul;


        data[index].kategori =
            req.body.kategori ||
            "Umum";


        data[index].gambar =
            req.body.gambar ||
            "";


        data[index].isi =
            req.body.isi;


        simpanArtikel(
            data
        );

        sinkronkanGitHubPages();

        res.json({

            status:
                "berhasil",

            artikel:
                data[index]

        });

    }
);


// ============================
// HAPUS ARTIKEL
// ============================

app.delete(
    "/api/artikel/:id",
    function (
        req,
        res
    ) {

        const data =
            bacaArtikel();


        const id =
            Number(
                req.params.id
            );


        const index =
            data.findIndex(
                function (a) {

                    return a.id === id;

                }
            );


        if (index === -1) {

            return res
                .status(404)
                .json({

                    status:
                        "gagal",

                    pesan:
                        "Artikel tidak ditemukan."

                });

        }


        data.splice(
            index,
            1
        );


        simpanArtikel(
            data
        );

        sinkronkanGitHubPages();
        res.json({

            status:
                "berhasil"

        });

    }
);


// ============================
// ERROR UPLOAD
// ============================

app.use(
    function (
        error,
        req,
        res,
        next
    ) {

        if (
            error instanceof
            multer.MulterError
        ) {

            return res
                .status(400)
                .json({

                    status:
                        "gagal",

                    pesan:
                        "Ukuran gambar maksimal 5 MB."

                });

        }


        if (error) {

            return res
                .status(400)
                .json({

                    status:
                        "gagal",

                    pesan:
                        error.message

                });

        }


        next();

    }
);


// ============================
// SERVER
// ============================
// ============================
// HALAMAN ARTIKEL SEO
// ============================

app.get(
    "/tutorial/:slug",
    function (req, res) {

        res.sendFile(
            path.join(
                __dirname,
                "public",
                "artikel.html"
            )
        );

    }
);
// ============================
// SITEMAP XML
// ============================

app.get(
    "/sitemap.xml",
    function (req, res) {

        const data =
            bacaArtikel();


        const baseUrl =
            "http://localhost:3000";


        let urls = "";


        data.forEach(
            function (artikel) {

                if (!artikel.slug) {
                    return;
                }


                urls += `
<url>
    <loc>${baseUrl}/tutorial/${artikel.slug}</loc>
    <lastmod>${artikel.tanggal}</lastmod>
</url>`;

            }
        );


        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>

<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<url>
    <loc>${baseUrl}/</loc>
</url>

${urls}

</urlset>`;


        res.type(
            "application/xml"
        );


        res.send(
            sitemap
        );

    }
);
app.listen(
    PORT,
    function () {

        console.log(
            "Website Tutorial berjalan di http://localhost:" +
            PORT
        );

    }
);