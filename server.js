import serve from "serve";

// Pastikan port menggunakan variable dari Railway
const port = process.env.PORT || 8080;

serve("dist", {
  port: port,
  host: "0.0.0.0", // Wajib agar Railway bisa melakukan health check
  single: true,
});

console.log(`Server is running on port ${port}`);