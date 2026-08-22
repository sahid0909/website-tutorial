const { execSync } = require("child_process");

function jalankan(command) {
    console.log("\n> " + command);

    execSync(command, {
        stdio: "inherit",
        cwd: process.cwd()
    });
}

try {

    console.log("=================================");
    console.log("   PUBLIKASI WEBSITE BELAJARTEKNO");
    console.log("=================================");

    // Generate halaman SEO dan sitemap
    jalankan("node tools/generate-pages.js");

    // Periksa perubahan
    jalankan("git status --short");

    // Tambahkan perubahan
    jalankan("git add database/artikel.json docs server.js public/uploads");

    // Cek apakah ada perubahan
    const status =
        execSync("git status --porcelain")
            .toString()
            .trim();

    if (!status) {

        console.log("\nTidak ada perubahan untuk dipublikasikan.");

        process.exit(0);
    }

    // Commit
    jalankan(
        'git commit -m "Update artikel dan halaman website"'
    );

    // Push
    jalankan("git push");

    console.log("\n=================================");
    console.log("   PUBLIKASI BERHASIL");
    console.log("=================================");

} catch (error) {

    console.error("\nPublikasi gagal.");
    console.error(error.message);

    process.exit(1);

}