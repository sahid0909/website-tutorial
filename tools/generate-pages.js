const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const DATA = path.join(DOCS, "artikel.json");

const BASE_URL = "https://sahid0909.github.io/website-tutorial";

const artikel = JSON.parse(
    fs.readFileSync(DATA, "utf8")
);

function escapeHtml(text) {
    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
function formatArticle(text) {
    let source = String(text || "");

    const sections = [
        {
            title: "1. Teks Berjalan Dasar (Ke Kiri)",
            start: "1. Teks Berjalan Dasar (Ke Kiri)",
            end: "2. Mengubah Arah Teks"
        },
        {
            title: "2. Mengubah Arah Teks",
            start: "2. Mengubah Arah Teks",
            end: "3. Mengatur Kecepatan Teks"
        },
        {
            title: "3. Mengatur Kecepatan Teks",
            start: "3. Mengatur Kecepatan Teks",
            end: "4. Mengatur Lebar Teks Berjalan"
        },
        {
            title: "4. Mengatur Lebar Teks Berjalan",
            start: "4. Mengatur Lebar Teks Berjalan",
            end: "5. Memantulkan Teks (Bounce)"
        },
        {
            title: "5. Memantulkan Teks (Bounce)",
            start: "5. Memantulkan Teks (Bounce)",
            end: null
        }
    ];

    let html = "";

    sections.forEach(function (section) {
        const startIndex = source.indexOf(section.start);

        if (startIndex === -1) {
            return;
        }

        let endIndex = section.end
            ? source.indexOf(section.end, startIndex + section.start.length)
            : source.length;

        if (endIndex === -1) {
            endIndex = source.length;
        }

        let content = source.substring(
            startIndex + section.start.length,
            endIndex
        ).trim();

        html += "<h2>" +
            escapeHtml(section.title) +
            "</h2>\n";

        content = escapeHtml(content);

        content = content.replace(
            /HTML/g,
            '<div class="code-label">HTML</div>'
        );

        content = content.replace(
            /&lt;marquee([\s\S]*?)&gt;([\s\S]*?)&lt;\/marquee&gt;/gi,
            '<pre class="code-block"><code>&lt;marquee$1&gt;$2&lt;/marquee&gt;</code></pre>'
        );

        content = content.replace(
            /\n+/g,
            "<br>"
        );

        html += content + "\n";
    });

    return html;
}
function buatSlug(teks) {

    return String(teks || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

}

artikel.forEach(article => {

    if (!article.slug) {
        return;
    }

    const folder = path.join(
        DOCS,
        "tutorial",
        article.slug
    );

    fs.mkdirSync(folder, {
        recursive: true
    });

    const title =
        escapeHtml(article.judul);

    const description =
        escapeHtml(
            String(article.isi || "")
                .substring(0, 155)
        );

    const image =
        article.gambar
            ? BASE_URL + article.gambar
            : "";
            const schema = JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": article.judul || "",
                "description": String(article.isi || "").substring(0, 155),
                "url": `${BASE_URL}/tutorial/${article.slug}/`,
                "datePublished": article.tanggal || "",
                "dateModified": article.tanggal || "",
                "author": {
                    "@type": "Organization",
                    "name": "BelajarTeknologi"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "BelajarTeknologi"
                },
                ...(image ? { "image": [image] } : {})
            }).replace(/</g, "\\u003c");
    const html =
    `<!DOCTYPE html>
<html lang="id">

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<title>${title} - BelajarTeknologi</title>

<meta name="description"
      content="${description}">

<meta name="robots"
      content="index, follow">

<link rel="canonical"
      href="${BASE_URL}/tutorial/${article.slug}/">

<meta property="og:type"
      content="article">

<meta property="og:title"
      content="${title}">

      <meta property="og:description"
      content="${description}">

<meta property="og:url"
      content="${BASE_URL}/tutorial/${article.slug}/">

${article.tanggal
    ? `<meta property="article:published_time" content="${article.tanggal}">`
    : ""}

<meta property="article:section"
      content="${escapeHtml(article.kategori || "Umum")}">

${image ? `<meta property="og:image" content="${image}">` : ""}

<meta name="twitter:card"
      content="summary_large_image">

<meta name="twitter:title"
      content="${title}">

<meta name="twitter:description"
      content="${description}">

${image
    ? `<meta name="twitter:image" content="${image}">`
    : ""}

<script type="application/ld+json">
${schema}
</script>

<link rel="stylesheet"
      href="../../style.css">

</head>

<body>

<header class="header">

<div class="container navbar">

<div class="logo">
Belajar<span>Tekno</span>
</div>

<nav>
<a href="../../">Beranda</a>
<a href="../../#kategori">Kategori</a>
</nav>

</div>

</header>

<main class="container">

<article class="article-page">
<nav class="breadcrumb">
<a href="../../">
Beranda
</a>
>
<a href="../../kategori/${buatSlug(article.kategori || "Umum")}/">
${escapeHtml(article.kategori || "Umum")}
</a>
>
<span>
${title}
</span>
</nav>
<div class="category">
${escapeHtml(article.kategori || "Umum")}
</div>

<h1>${title}</h1>

<p>
${article.tanggal
    ? new Date(article.tanggal)
        .toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    : ""}
</p>

<hr>

${
    article.gambar
    ? `<img
        src="../../${article.gambar.replace(/^\//, "")}"
        alt="${title}"
        style="width:100%;max-height:450px;object-fit:cover;border-radius:10px;margin:25px 0;"
      >`
    : ""
}

<div class="article-content">

${formatArticle(article.isi)}

</div>

<br>

<a href="../../">
? Kembali ke halaman utama
</a>

</article>

</main>

<footer>

<div class="container">

<h3>BelajarTeknologi</h3>

<p>
Belajar teknologi dengan tutorial sederhana
dan mudah dipahami.
</p>

<p>
RK GROUP ? 2026 BelajarTeknologi
</p>

</div>

</footer>

</body>

</html>`;

    fs.writeFileSync(
        path.join(folder, "index.html"),
        html,
        "utf8"
    );

    console.log(
        "Membuat:",
        `tutorial/${article.slug}/index.html`
    );
});

// ============================
// BUAT HALAMAN KATEGORI
// ============================

const kategoriUnik =
    [...new Set(
        artikel
            .map(function (article) {
                return (
                    article.kategori ||
                    "Umum"
                );
            })
            .filter(Boolean)
    )];

kategoriUnik.forEach(
    function (kategori) {

        const slugKategori =
            buatSlug(kategori);

        const folder =
            path.join(
                DOCS,
                "kategori",
                slugKategori
            );

        fs.mkdirSync(
            folder,
            {
                recursive: true
            }
        );

        const artikelKategori =
            artikel.filter(
                function (article) {

                    return (
                        (
                            article.kategori ||
                            "Umum"
                        ).toLowerCase()
                        ===
                        kategori.toLowerCase()
                    );

                }
            );

        const daftarArtikel =
            artikelKategori.map(
                function (article) {

                    return `
<article class="card">

<h3>
<a href="../../tutorial/${article.slug}/">
${escapeHtml(article.judul)}
</a>
</h3>

<p>
${escapeHtml(
    String(article.isi || "")
        .substring(0, 150)
)}...
</p>

</article>
`;

                }
            ).join("");

        const html = `<!DOCTYPE html>
<html lang="id">

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width, initial-scale=1.0">

<title>
Kategori ${escapeHtml(kategori)} - BelajarTeknologi
</title>
<meta name="description"
      content="Tutorial kategori ${escapeHtml(kategori)} di BelajarTeknologi.">
      <meta property="og:type"
      content="website">
<meta property="og:title"
      content="Kategori ${escapeHtml(kategori)} - BelajarTeknologi">
<meta property="og:description"
      content="Tutorial kategori ${escapeHtml(kategori)} di BelajarTeknologi.">
<meta property="og:url"
      content="${BASE_URL}/kategori/${slugKategori}/">
<meta name="twitter:card"
      content="summary_large_image">
<meta name="twitter:title"
      content="Kategori ${escapeHtml(kategori)} - BelajarTeknologi">
<meta name="twitter:description"
      content="Tutorial kategori ${escapeHtml(kategori)} di BelajarTeknologi.">
<script type="application/ld+json">
${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Kategori ${kategori}`,
    "url": `${BASE_URL}/kategori/${slugKategori}/`,
    "description": `Tutorial kategori ${kategori} di BelajarTeknologi.`
})}
</script
<link rel="canonical"
      href="${BASE_URL}/kategori/${slugKategori}/">

<link rel="stylesheet"
      href="../../style.css">

</head>

<body>

<header class="header">

<div class="container navbar">

<div class="logo">
Belajar<span>Tekno</span>
</div>

<nav>

<a href="../../">
Beranda
</a>

<a href="../../#kategori">
Kategori
</a>

</nav>

</div>

</header>

<main class="container">

<h1>
Kategori: ${escapeHtml(kategori)}
</h1>

<div class="articles">

${daftarArtikel}

</div>

</main>

<footer>

<div class="container">

<h3>
BelajarTeknologi
</h3>

<p>
Belajar teknologi dengan tutorial sederhana
dan mudah dipahami.
</p>

<p>
RK GROUP � 2026 BelajarTeknologi
</p>

</div>

</footer>

</body>

</html>`;
fs.writeFileSync(
    path.join(folder, "index.html"),
    html.replace(/[ \t]+$/gm, ""),
    "utf8"
);
        console.log(
            "Membuat:",
            `kategori/${slugKategori}/index.html`
        );

    }
);
const urls = [
    BASE_URL + "/"
];
kategoriUnik.forEach(
    function (kategori) {

        urls.push(
            `${BASE_URL}/kategori/${buatSlug(kategori)}/`
        );

    }
);
artikel.forEach(article => {

    if (article.slug) {

        urls.push(
            `${BASE_URL}/tutorial/${article.slug}/`
        );

    }

});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls.map(url => `
<url>
    <loc>${url}</loc>
</url>
`).join("")}

</urlset>`;

fs.writeFileSync(
    path.join(DOCS, "sitemap.xml"),
    sitemap.trim(),
    "utf8"
);

console.log("");
console.log("Sitemap berhasil dibuat.");
console.log("Jumlah URL:", urls.length);
