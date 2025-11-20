import { db } from "./db";
import { users } from "@shared/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    const adminUsername = "admin";
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.username, adminUsername))
      .limit(1);

    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      await db.insert(users).values({
        username: adminUsername,
        password: hashedPassword,
        email: "admin@camazac.com",
        fullName: "Administrador CaMaZac",
        isAdmin: true,
      });

      console.log("✅ Admin user created:");
      console.log("   Username: admin");
      console.log("   Password: admin123");
      console.log("   Email: admin@camazac.com");
    } else {
      console.log("ℹ️  Admin user already exists");
    }

    console.log("✅ Seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
