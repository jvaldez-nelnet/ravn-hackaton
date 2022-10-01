-- CreateEnum
CREATE TYPE "Status" AS ENUM ('APPROVED', 'PENDING', 'REJECTED');

-- AlterTable
ALTER TABLE "team_members" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
