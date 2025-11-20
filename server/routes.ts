import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { insertUserSchema, insertPropertySchema, insertMessageSchema } from "@shared/schema";
import type { User } from "@shared/schema";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

const uploadsDir = path.join(process.cwd(), "uploads");
fs.mkdir(uploadsDir, { recursive: true });

const multerStorage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes (jpeg, jpg, png, webp)"));
    }
  },
});

function requireAuth(req: any, res: any, next: any) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "No autorizado" });
  }
  next();
}

async function requireAdmin(req: any, res: any, next: any) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "No autorizado" });
  }
  const user = await storage.getUser(req.session.userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "camazac-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );

  app.use("/uploads", async (req, res, next) => {
    const filePath = path.join(uploadsDir, path.basename(req.path));
    try {
      await fs.access(filePath);
      res.sendFile(filePath);
    } catch {
      res.status(404).json({ message: "Archivo no encontrado" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(data.username);
      if (existingUser) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }

      const existingEmail = await storage.getUserByEmail(data.email);
      if (existingEmail) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await storage.createUser({
        ...data,
        password: hashedPassword,
        isAdmin: false,
      });

      req.session.userId = user.id;
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Error al crear usuario" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Usuario y contraseña requeridos" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      req.session.userId = user.id;
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: "Error al iniciar sesión" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error al cerrar sesión" });
      }
      res.json({ message: "Sesión cerrada exitosamente" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.json(null);
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.json(null);
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.get("/api/properties", async (_req, res) => {
    try {
      const properties = await storage.getAllProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener propiedades" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Propiedad no encontrada" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener propiedad" });
    }
  });

  app.post("/api/properties", requireAdmin, upload.array("images", 5), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      const imageUrls = files.map((file) => `/uploads/${file.filename}`);

      const propertyData = {
        title: req.body.title,
        description: req.body.description,
        address: req.body.address,
        price: parseInt(req.body.price),
        type: req.body.type,
        images: imageUrls,
      };

      const validated = insertPropertySchema.parse(propertyData);
      const property = await storage.createProperty(validated);
      res.json(property);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Error al crear propiedad" });
    }
  });

  app.patch("/api/properties/:id", requireAdmin, upload.array("images", 5), async (req, res) => {
    try {
      const existingProperty = await storage.getProperty(req.params.id);
      if (!existingProperty) {
        return res.status(404).json({ message: "Propiedad no encontrada" });
      }

      const files = req.files as Express.Multer.File[];
      const newImageUrls = files.map((file) => `/uploads/${file.filename}`);
      
      const existingImages = req.body.existingImages 
        ? JSON.parse(req.body.existingImages) 
        : [];

      const allImages = [...existingImages, ...newImageUrls];

      const imagesToDelete = existingProperty.images.filter(
        (img) => !existingImages.includes(img)
      );
      
      for (const imgUrl of imagesToDelete) {
        try {
          const filename = path.basename(imgUrl);
          await fs.unlink(path.join(uploadsDir, filename));
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }

      const updateData = {
        title: req.body.title,
        description: req.body.description,
        address: req.body.address,
        price: parseInt(req.body.price),
        type: req.body.type,
        images: allImages,
      };

      const property = await storage.updateProperty(req.params.id, updateData);
      if (!property) {
        return res.status(404).json({ message: "Propiedad no encontrada" });
      }

      res.json(property);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Error al actualizar propiedad" });
    }
  });

  app.delete("/api/properties/:id", requireAdmin, async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Propiedad no encontrada" });
      }

      for (const imgUrl of property.images) {
        try {
          const filename = path.basename(imgUrl);
          await fs.unlink(path.join(uploadsDir, filename));
        } catch (err) {
          console.error("Error deleting image:", err);
        }
      }

      const deleted = await storage.deleteProperty(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Propiedad no encontrada" });
      }

      res.json({ message: "Propiedad eliminada exitosamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar propiedad" });
    }
  });

  app.get("/api/messages", requireAdmin, async (_req, res) => {
    try {
      const messages = await storage.getAllMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener mensajes" });
    }
  });

  app.post("/api/messages", requireAuth, async (req, res) => {
    try {
      const data = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(data);
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Error al crear mensaje" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
