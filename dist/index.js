var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express from "express";
import path2 from "path";
import { fileURLToPath } from "url";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertMessageSchema: () => insertMessageSchema,
  insertPropertySchema: () => insertPropertySchema,
  insertUserSchema: () => insertUserSchema,
  messages: () => messages,
  properties: () => properties,
  users: () => users
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  price: integer("price").notNull(),
  type: text("type").notNull(),
  images: text("images").array().notNull().default(sql`ARRAY[]::text[]`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});
var messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  propertyId: varchar("property_id").notNull().references(() => properties.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  userName: text("user_name").notNull(),
  userEmail: text("user_email").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import dotenv from "dotenv";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
dotenv.config();
if (!process.env.DATABASE_URL) {
  throw new Error("No existe DATABASE_URL");
}
var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // 'require' is not a valid ConnectionOptions property; keep supported TLS options
    rejectUnauthorized: false
    // <--- EVITA EL ERROR DE CERTIFICADO
  }
});
var db = drizzle(pool, { schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async getAllProperties() {
    return await db.select().from(properties);
  }
  async getProperty(id) {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property || void 0;
  }
  async createProperty(insertProperty) {
    const [property] = await db.insert(properties).values(insertProperty).returning();
    return property;
  }
  async updateProperty(id, updateData) {
    const [property] = await db.update(properties).set({ ...updateData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(properties.id, id)).returning();
    return property || void 0;
  }
  async deleteProperty(id) {
    const result = await db.delete(properties).where(eq(properties.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
  async getAllMessages() {
    return await db.select().from(messages);
  }
  async createMessage(insertMessage) {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import session from "express-session";
import bcrypt from "bcryptjs";
import multer, { MulterError } from "multer";
import path from "path";
import fs from "fs/promises";
var uploadsDir = path.join(process.cwd(), "uploads");
fs.mkdir(uploadsDir, { recursive: true }).catch(() => {
});
var multerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
var upload = multer({
  storage: multerStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (!ext || !mime) {
      const fileFilter = (req, file2, cb2) => {
        const allowed2 = ["image/png", "image/jpg", "image/jpeg"];
        if (!allowed2.includes(file2.mimetype)) {
          return cb2(new Error("Solo se permiten im\xE1genes"));
        }
        return cb2(null, true);
      };
      return cb(new MulterError("LIMIT_UNEXPECTED_FILE", "images"));
    }
    cb(null, true);
  }
});
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "No autorizado" });
  }
  next();
}
async function requireAdmin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "No autorizado" });
  }
  const user = await storage.getUser(req.session.userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  next();
}
async function registerRoutes(app2) {
  app2.use(
    session({
      secret: process.env.SESSION_SECRET || "secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 1e3 * 60 * 60 * 24 * 7
      }
    })
  );
  app2.use("/uploads", async (req, res) => {
    const file = path.join(uploadsDir, path.basename(req.path));
    try {
      await fs.access(file);
      res.sendFile(file);
    } catch {
      res.status(404).json({ message: "Archivo no encontrado" });
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existsUser = await storage.getUserByUsername(data.username);
      if (existsUser)
        return res.status(400).json({ message: "El usuario ya existe" });
      const existsEmail = await storage.getUserByEmail(data.email);
      if (existsEmail)
        return res.status(400).json({ message: "El email ya est\xE1 registrado" });
      const hashed = await bcrypt.hash(data.password, 10);
      const user = await storage.createUser({
        ...data,
        password: hashed,
        isAdmin: false
      });
      req.session.userId = user.id;
      const { password: _, ...clean } = user;
      res.json(clean);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await storage.getUserByUsername(username);
    if (!user) return res.status(401).json({ message: "Credenciales incorrectas" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Credenciales incorrectas" });
    req.session.userId = user.id;
    const { password: _, ...clean } = user;
    res.json(clean);
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Sesi\xF3n cerrada" });
    });
  });
  app2.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) return res.json(null);
    const user = await storage.getUser(req.session.userId);
    if (!user) return res.json(null);
    const { password: _, ...clean } = user;
    res.json(clean);
  });
  app2.get("/api/properties", async (_req, res) => {
    const props = await storage.getAllProperties();
    res.json(props);
  });
  app2.post(
    "/api/properties",
    requireAdmin,
    upload.array("images", 5),
    async (req, res) => {
      try {
        const images = req.files.map(
          (f) => `/uploads/${f.filename}`
        );
        const data = insertPropertySchema.parse({
          ...req.body,
          price: Number(req.body.price),
          images
        });
        const prop = await storage.createProperty(data);
        res.json(prop);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    }
  );
  app2.post("/api/messages", requireAuth, async (req, res) => {
    try {
      const data = insertMessageSchema.parse(req.body);
      const msg = await storage.createMessage(data);
      res.json(msg);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/index.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path2.dirname(__filename);
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path2.join(__dirname, "uploads")));
var uploadsDir2 = path2.join(__dirname, "uploads");
registerRoutes(app);
var port = parseInt(process.env.PORT || "5000", 10);
var publicPath = path2.join(__dirname, "../../dist");
app.use(express.static(publicPath));
app.get("/health", (_, res) => res.send("ok"));
app.get("*", (_, res) => {
  res.sendFile(path2.join(publicPath, "index.html"));
});
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
var index_default = app;
export {
  index_default as default
};
