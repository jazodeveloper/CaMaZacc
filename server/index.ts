import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Registrar rutas backend (API)
registerRoutes(app);

// ---------------------------
// SERVIR FRONTEND EN PRODUCCIÓN
// ---------------------------

// ESTA ES LA RUTA CORRECTA DEL BUILD DE VITE
const publicPath = path.join(__dirname, "../dist/public");

app.use(express.static(publicPath));

// Cualquier ruta devuelve el index.html dentro del build
app.get("/", (req, res) => {
  res.send("API working");
});

app.use(express.static(publicPath));
app.get("*", (_req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// ---------------------------
// INICIAR SERVIDOR
// ---------------------------

const port = parseInt(process.env.PORT || "5000", 10);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
export default app;