const serve = require("serve");

const port = process.env.PORT || 3000;

serve("dist", {
  port,
  single: true, // penting untuk SPA
});