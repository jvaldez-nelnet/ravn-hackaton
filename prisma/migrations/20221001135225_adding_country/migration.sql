/*
  Warnings:

  - Added the required column `country` to the `team_members` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Country" AS ENUM ('USA', 'SV', 'PE');

-- AlterTable
ALTER TABLE "team_members" ADD COLUMN     "country" "Country" NOT NULL,
ALTER COLUMN "slackId" DROP NOT NULL,
ALTER COLUMN "clockifyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "slack_access_token" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
