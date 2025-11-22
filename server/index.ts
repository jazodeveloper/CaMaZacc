import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Registrar tus rutas API
registerRoutes(app);

// ---------------------------
// SERVIR FRONTEND EN PRODUCCIÓN
// ---------------------------
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "..", "client", "dist");

  app.use(express.static(distPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
// ---------------------------
// INICIAR SERVIDOR
// ---------------------------

const port = parseInt(process.env.PORT || "5000", 10);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
