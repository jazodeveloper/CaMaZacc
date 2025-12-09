import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const uploadsDir = path.join(__dirname, "uploads");

// Registrar rutas backend (API)
registerRoutes(app);

// PORT
const port = parseInt(process.env.PORT || "5000", 10);

// -------------------------------------
// SERVIR FRONTEND EN PRODUCCIÓN
// -------------------------------------

// 👉 Ruta correcta del build de Vite
const publicPath = path.join(__dirname, "../../dist");

// Archivos estáticos
app.use(express.static(publicPath));

// Health check para Railway
app.get("/health", (_, res) => res.send("ok"));

// SPA fallback
app.get("*", (_, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Escuchar en 0.0.0.0 (OBLIGATORIO EN RAILWAY)
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});

export default app;
