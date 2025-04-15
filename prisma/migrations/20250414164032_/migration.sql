-- CreateEnum
CREATE TYPE "Lang" AS ENUM ('RU', 'UZ');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "language" "Lang" NOT NULL DEFAULT 'RU';
