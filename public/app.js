let semuaArtikel = [];


// ============================
// AMBIL ARTIKEL
// ============================

async function ambilArtikel() {

    try {

        const response =
            await fetch("/api/artikel");

                semuaArtikel =
            await response.json();

        tampilkanKategori(
            semuaArtikel
        );

        tampilkanArtikel(
            semuaArtikel
        );
    } catch (error) {

        document.getElementById(
            "artikel"
        ).innerHTML =
            "<p>Gagal mengambil artikel.</p>";

        console.log(error);

    }

}
// ============================
// TAMPILKAN KATEGORI
// ============================

function tampilkanKategori(data) {

    const container =
        document.getElementById(
            "kategoriList"
        );

    if (!container) {
        return;
    }

    const kategoriUnik =
        [...new Set(
            data
                .map(function (article) {
                    return (
                        article.kategori ||
                        "Umum"
                    );
                })
                .filter(Boolean)
        )];

    container.innerHTML = "";

    const tombolSemua =
        document.createElement(
            "button"
        );

    tombolSemua.textContent =
        "Semua";

    tombolSemua.onclick =
        function () {
            filterKategori("Semua");
        };

    container.appendChild(
        tombolSemua
    );

    kategoriUnik.forEach(
        function (kategori) {

            const tombol =
                document.createElement(
                    "button"
                );

            tombol.textContent =
                kategori;

            tombol.onclick =
                function () {
                    filterKategori(
                        kategori
                    );
                };

            container.appendChild(
                tombol
            );

        }
    );

}

// ============================
// TAMPILKAN ARTIKEL
// ============================

function tampilkanArtikel(data) {

    const container =
        document.getElementById(
            "artikel"
        );


    if (data.length === 0) {

        container.innerHTML = `
            <p>
                Tutorial tidak ditemukan.
            </p>
        `;

        return;

    }


    container.innerHTML = "";


    data.forEach(article => {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "card";


        card.innerHTML = `

            ${
                article.gambar
                ?
                `<img
                    src="${article.gambar}"
                    alt="${article.judul}"
                    style="width:100%;height:180px;object-fit:cover;border-radius:8px;margin-bottom:15px;"
                >`
                :
                ""
            }

            <div class="category">
                ${article.kategori || "Umum"}
            </div>

            <h3>
                ${article.judul}
            </h3>

            <p>
                ${article.isi.substring(0,150)}...
            </p>

            <button
                onclick="bacaArtikel(${article.id})"
            >
                Baca Tutorial
            </button>

        `;


        container.appendChild(
            card
        );

    });

}


// ============================
// PENCARIAN
// ============================

function cariArtikel() {

    const input =
        document.getElementById(
            "search"
        );


    if (!input) {

        return;

    }


    const kata =
        input.value
            .toLowerCase()
            .trim();


    const hasil =
        semuaArtikel.filter(
            function (article) {

                return (

                    article.judul
                        .toLowerCase()
                        .includes(kata)

                    ||

                    (article.kategori || "")
                        .toLowerCase()
                        .includes(kata)

                    ||

                    article.isi
                        .toLowerCase()
                        .includes(kata)

                );

            }
        );


    tampilkanArtikel(
        hasil
    );

}


// ============================
// FILTER KATEGORI
// ============================

// ============================
// FILTER KATEGORI
// ============================

// ============================
// LINK HALAMAN KATEGORI
// ============================

function filterKategori(kategori) {

    if (
        !kategori ||
        kategori === "Semua"
    ) {

        window.location.href =
        "/website-tutorial/";

        return;

    }

    const slug =
        kategori
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

    window.location.href =
        "/website-tutorial/kategori/" + slug + "/";
}

// ============================
// BACA ARTIKEL
// ============================

function bacaArtikel(id) {

    const artikel =
        semuaArtikel.find(
            function (a) {

                return a.id === id;

            }
        );


    if (!artikel) {

        return;

    }


    if (artikel.slug) {

        window.location.href =
            "/tutorial/" +
            artikel.slug;

    } else {

        localStorage.setItem(
            "artikelTerpilih",
            JSON.stringify(
                artikel
            )
        );


        window.location.href =
            "artikel.html";

    }

}


// ============================
// MULAI
// ============================
// ============================
// KATEGORI DARI URL
// ============================

function bacaKategoriDariURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const kategori =
        params.get("kategori");


    if (!kategori) {

        return;

    }


    const hasil =
        semuaArtikel.filter(
            function (article) {

                return (
                    (article.kategori || "")
                        .toLowerCase()
                        ===
                    kategori
                        .toLowerCase()
                );

            }
        );


    tampilkanArtikel(
        hasil
    );

}
async function mulaiWebsite() {

    await ambilArtikel();

    bacaKategoriDariURL();

}

mulaiWebsite();