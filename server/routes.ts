import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.ts";
import session from "express-session";
import bcrypt from "bcryptjs";
import multer, { MulterError } from "multer";
import path from "path";
import fs from "fs/promises";
import { insertUserSchema, insertPropertySchema, insertMessageSchema } from "../shared/schema.ts";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

const uploadsDir = path.join(process.cwd(), "uploads");

// ❌ PROBLEMA: top level await
// fs.mkdir(uploadsDir, { recursive: true });

// ✔️ SOLUCIÓN SIN ERROR
fs.mkdir(uploadsDir, { recursive: true }).catch(() => {});

// ----------------------------
// MULTER CONFIG
// ----------------------------
const multerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);

    if (!ext || !mime) {
      // ❌ ERROR QUE TENÍAS
      const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  const allowed = ["image/png", "image/jpg", "image/jpeg"];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Solo se permiten imágenes"));
  }

  return cb(null, true);
};

      // cb(new Error("Solo se permiten imágenes"));
      return cb(new MulterError("LIMIT_UNEXPECTED_FILE", "images"));
    } 
    cb(null, true);
  },
});

// ----------------------------
// MIDDLEWARES
// ----------------------------
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "No autorizado" });
  }
  next();
}

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "No autorizado" });
  }
  const user = await storage.getUser(req.session.userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  next();
}

// ----------------------------
// RUTAS PRINCIPALES
// ----------------------------
export async function registerRoutes(app: Express): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );

  // SERVIR ARCHIVOS /uploads
  app.use("/uploads", async (req, res) => {
    const file = path.join(uploadsDir, path.basename(req.path));
    try {
      await fs.access(file);
      res.sendFile(file);
    } catch {
      res.status(404).json({ message: "Archivo no encontrado" });
    }
  });

  // ----------------------------
  // AUTH
  // ----------------------------
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);

      const existsUser = await storage.getUserByUsername(data.username);
      if (existsUser)
        return res.status(400).json({ message: "El usuario ya existe" });

      const existsEmail = await storage.getUserByEmail(data.email);
      if (existsEmail)
        return res.status(400).json({ message: "El email ya está registrado" });

      const hashed = await bcrypt.hash(data.password, 10);
      const user = await storage.createUser({
        ...data,
        password: hashed,
        isAdmin: false,
      });

      req.session.userId = user.id;
      const { password: _, ...clean } = user;
      res.json(clean);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await storage.getUserByUsername(username);
    if (!user) return res.status(401).json({ message: "Credenciales incorrectas" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Credenciales incorrectas" });

    req.session.userId = user.id;
    const { password: _, ...clean } = user;
    res.json(clean);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Sesión cerrada" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) return res.json(null);

    const user = await storage.getUser(req.session.userId);
    if (!user) return res.json(null);

    const { password: _, ...clean } = user;
    res.json(clean);
  });

  // ----------------------------
  // PROPERTIES CRUD
  // ----------------------------
  app.get("/api/properties", async (_req, res) => {
    const props = await storage.getAllProperties();
    res.json(props);
  });

  app.post(
    "/api/properties",
    requireAdmin,
    upload.array("images", 5),
    async (req, res) => {
      try {
        const images = (req.files as Express.Multer.File[]).map(
          (f) => `/uploads/${f.filename}`
        );

        const data = insertPropertySchema.parse({
          ...req.body,
          price: Number(req.body.price),
          images,
        });

        const prop = await storage.createProperty(data);
        res.json(prop);
      } catch (err: any) {
        res.status(400).json({ message: err.message });
      }
    }
  );

  // ----------------------------
  // MESSAGES
  // ----------------------------
  app.post("/api/messages", requireAuth, async (req, res) => {
    try {
      const data = insertMessageSchema.parse(req.body);
      const msg = await storage.createMessage(data);
      res.json(msg);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
