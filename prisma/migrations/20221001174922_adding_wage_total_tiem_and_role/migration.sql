-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('DEVELOPER', 'DESIGNER');

-- AlterTable
ALTER TABLE "team_members" ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'DEVELOPER',
ADD COLUMN     "totalTime" TEXT,
ADD COLUMN     "wage" INTEGER NOT NULL DEFAULT 3;
