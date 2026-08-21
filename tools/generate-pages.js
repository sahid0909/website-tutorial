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

    const html = `<!DOCTYPE html>
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

${image ? `<meta property="og:image" content="${image}">` : ""}

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

${escapeHtml(article.isi)}

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
RK GROUP © 2026 BelajarTeknologi
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


const urls = [
    BASE_URL + "/"
];

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