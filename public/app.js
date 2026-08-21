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
            "pencarian"
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

function filterKategori(
    kategori
) {

    if (
        !kategori ||
        kategori === "Semua"
    ) {

        tampilkanArtikel(
            semuaArtikel
        );

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


// ============================
// TAMPILKAN SEMUA
// ============================

function tampilkanSemua() {

    tampilkanArtikel(
        semuaArtikel
    );

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

ambilArtikel();