-- CreateTable
CREATE TABLE "team_members" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "slackId" TEXT NOT NULL,
    "clockifyId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "team_members_uuid_key" ON "team_members"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_email_key" ON "team_members"("email");
