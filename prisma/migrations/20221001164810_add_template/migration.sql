-- CreateTable
CREATE TABLE "Template" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "template" TEXT NOT NULL,
    "location" "Country" NOT NULL DEFAULT 'PE',
    "description" TEXT,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Template_uuid_key" ON "Template"("uuid");
