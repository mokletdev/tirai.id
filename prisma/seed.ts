import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 12;

async function main() {
  console.log("Starting seeding...");

  await prisma.user.deleteMany();

  const users: {
    name: string;
    email: string;
    is_verified: true;
    password: string;
    role: Role;
  }[] = [
    {
      name: "Admin User",
      email: "admin@tirai.id",
      is_verified: true,
      password: await hash("adminpassword", BCRYPT_ROUNDS),
      role: "ADMIN",
    },
    {
      name: "Affiliate User",
      email: "affiliate@tirai.id",
      is_verified: true,
      password: await hash("affiliatepassword", BCRYPT_ROUNDS),
      role: "AFFILIATE",
    },
    {
      name: "Customer User",
      email: "customer@tirai.id",
      is_verified: true,
      password: await hash("customerpassword", BCRYPT_ROUNDS),
      role: "CUSTOMER",
    },
    {
      name: "Agent User",
      email: "agent@tirai.id",
      is_verified: true,
      password: await hash("agentpassword", BCRYPT_ROUNDS),
      role: "AGENT",
    },
    {
      name: "Packaging User",
      email: "packaging@tirai.id",
      is_verified: true,
      password: await hash("packagingpassword", BCRYPT_ROUNDS),
      role: "PACKAGING",
    },
    {
      name: "Production User",
      email: "production@tirai.id",
      is_verified: true,
      password: await hash("productionpassword", BCRYPT_ROUNDS),
      role: "PRODUCTION",
    },
    {
      name: "Super Admin",
      email: "superadmin@tirai.id",
      is_verified: true,
      password: await hash("superadminpassword", BCRYPT_ROUNDS),
      role: "SUPERADMIN",
    },
    {
      name: "Sales User",
      email: "sales@tirai.id",
      is_verified: true,
      password: await hash("salespassword", BCRYPT_ROUNDS),
      role: "SALES",
    },
    {
      name: "Content Writer",
      email: "contentwriter@tirai.id",
      is_verified: true,
      password: await hash("contentwriterpassword", BCRYPT_ROUNDS),
      role: "CONTENTWRITER",
    },
  ];

  await prisma.user.createMany({ data: users });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
