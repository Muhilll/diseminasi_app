const serve = require("serve");

const port = process.env.PORT || 8080; // Railway biasanya pakai 8080, tapi process.env.PORT akan menangkapnya otomatis

serve("dist", {
  port,
  host: "0.0.0.0", // TAMBAHKAN INI agar bisa diakses secara publik
  single: true,    // Bagus untuk React/Vue (SPA) agar routing tidak 404 saat di-refresh
});

console.log(`Server running on port ${port}`);