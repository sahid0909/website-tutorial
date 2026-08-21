let semuaArtikel = [];

async function ambilArtikel() {
    try {
        const response = await fetch("./artikel.json");

        semuaArtikel = await response.json();

        tampilkanArtikel(semuaArtikel);

    } catch (error) {
        document.getElementById("artikel").innerHTML =
            "<p>Gagal mengambil artikel.</p>";

        console.log(error);
    }
}

function tampilkanArtikel(data) {

    const container =
        document.getElementById("artikel");

    if (data.length === 0) {

        container.innerHTML =
            "<p>Belum ada tutorial.</p>";

        return;
    }

    container.innerHTML = "";

    data.forEach(function(article) {

        const card =
            document.createElement("article");

        card.className = "card";

        card.innerHTML = `
            ${
                article.gambar
                ?
                `<img
                    src="${article.gambar ? '.' + article.gambar : ''}"
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
                ${(article.isi || "").substring(0,150)}...
            </p>

            <button
                onclick="bacaArtikel('${article.slug || ""}')"
            >
                Baca Tutorial
            </button>
        `;

        container.appendChild(card);
    });
}

function cariArtikel() {

    const input =
        document.getElementById("search");

    if (!input) return;

    const kata =
        input.value.toLowerCase().trim();

    const hasil =
        semuaArtikel.filter(function(article) {

            return (
                (article.judul || "")
                    .toLowerCase()
                    .includes(kata)

                ||

                (article.kategori || "")
                    .toLowerCase()
                    .includes(kata)

                ||

                (article.isi || "")
                    .toLowerCase()
                    .includes(kata)
            );
        });

    tampilkanArtikel(hasil);
}

function filterKategori(kategori) {

    if (!kategori || kategori === "Semua") {

        tampilkanArtikel(semuaArtikel);

        return;
    }

    const hasil =
        semuaArtikel.filter(function(article) {

            return (
                (article.kategori || "")
                    .toLowerCase()
                    ===
                kategori.toLowerCase()
            );
        });

    tampilkanArtikel(hasil);
}

function bacaArtikel(slug) {

    if (!slug) return;

    window.location.href =
        "artikel.html?slug=" +
        encodeURIComponent(slug);
}

ambilArtikel();