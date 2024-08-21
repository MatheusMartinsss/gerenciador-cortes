-- CreateEnum
CREATE TYPE "TreeStatus" AS ENUM ('NONE', 'PARTIAL', 'FULL');

-- AlterTable
ALTER TABLE "tree" ADD COLUMN     "status" "TreeStatus" NOT NULL DEFAULT 'NONE';
