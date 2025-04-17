import { PrismaClient } from "@/prisma/generated/prisma/client";

export const db = new PrismaClient();
