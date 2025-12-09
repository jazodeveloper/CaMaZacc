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

app.set("port", process.env.PORT || 5000);
// ---------------------------
// SERVIR FRONTEND EN PRODUCCIÓN
// ---------------------------

// ESTA ES LA RUTA CORRECTA DEL BUILD DE VITE
// 🚀 Ruta correcta donde Vite deja la build
const publicPath = path.join(__dirname, "../dist");

// Servir archivos estáticos
const port = parseInt(process.env.PORT || "5000", 10);
app.use(express.static(publicPath));

// 🧪 Endpoint básico para que Railway haga health check
app.get("/health", (req, res) => {
  res.send("ok");
});

// Cualquier ruta devuelve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}).on("listening", () => {
  console.log("Listening on 0.0.0.0");
});
app.set("host", "0.0.0.0");


export default app;