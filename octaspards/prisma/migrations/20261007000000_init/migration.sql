-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateEnum
CREATE TYPE "CrossRefType" AS ENUM ('EQUIVALENT', 'SUPERSEDES', 'SUPERSEDED_BY');

-- CreateTable
CREATE TABLE "Manufacturer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "country" TEXT,
    "color" TEXT NOT NULL DEFAULT '#1F4FE0',

    CONSTRAINT "Manufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" SERIAL NOT NULL,
    "manufacturerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "yearFrom" INTEGER,
    "yearTo" INTEGER,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleType" (
    "id" SERIAL NOT NULL,
    "modelId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "engineCode" TEXT,
    "fuel" TEXT,
    "powerKw" INTEGER,
    "capacityCc" INTEGER,
    "yearFrom" INTEGER,
    "yearTo" INTEGER,
    "searchLabel" TEXT NOT NULL,

    CONSTRAINT "VehicleType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssemblyGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,

    CONSTRAINT "AssemblyGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "assemblyGroupId" INTEGER,

    CONSTRAINT "ProductGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Part" (
    "id" SERIAL NOT NULL,
    "partNumber" TEXT NOT NULL,
    "partNumberNorm" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "description" TEXT,
    "specs" JSONB,
    "brandId" INTEGER NOT NULL,
    "productGroupId" INTEGER NOT NULL,
    "assemblyGroupId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OeNumber" (
    "id" SERIAL NOT NULL,
    "partId" INTEGER NOT NULL,
    "manufacturerId" INTEGER,
    "number" TEXT NOT NULL,
    "numberNorm" TEXT NOT NULL,

    CONSTRAINT "OeNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrossReference" (
    "id" SERIAL NOT NULL,
    "partId" INTEGER NOT NULL,
    "brandName" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "numberNorm" TEXT NOT NULL,
    "type" "CrossRefType" NOT NULL DEFAULT 'EQUIVALENT',

    CONSTRAINT "CrossReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fitment" (
    "partId" INTEGER NOT NULL,
    "vehicleTypeId" INTEGER NOT NULL,

    CONSTRAINT "Fitment_pkey" PRIMARY KEY ("partId","vehicleTypeId")
);

-- CreateTable
CREATE TABLE "Banner" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "titleAr" TEXT,
    "subtitle" TEXT,
    "subtitleAr" TEXT,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecentSearch" (
    "id" SERIAL NOT NULL,
    "userKey" TEXT NOT NULL,
    "manufacturerId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecentSearch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Manufacturer_name_key" ON "Manufacturer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Manufacturer_slug_key" ON "Manufacturer"("slug");

-- CreateIndex
CREATE INDEX "Manufacturer_name_trgm_idx" ON "Manufacturer" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Model_manufacturerId_idx" ON "Model"("manufacturerId");

-- CreateIndex
CREATE UNIQUE INDEX "Model_manufacturerId_name_key" ON "Model"("manufacturerId", "name");

-- CreateIndex
CREATE INDEX "VehicleType_modelId_idx" ON "VehicleType"("modelId");

-- CreateIndex
CREATE INDEX "VehicleType_searchLabel_trgm_idx" ON "VehicleType" USING GIN ("searchLabel" gin_trgm_ops);

-- CreateIndex
CREATE UNIQUE INDEX "VehicleType_modelId_name_key" ON "VehicleType"("modelId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- CreateIndex
CREATE INDEX "Brand_name_trgm_idx" ON "Brand" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE UNIQUE INDEX "AssemblyGroup_name_key" ON "AssemblyGroup"("name");

-- CreateIndex
CREATE INDEX "AssemblyGroup_name_trgm_idx" ON "AssemblyGroup" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE UNIQUE INDEX "ProductGroup_name_key" ON "ProductGroup"("name");

-- CreateIndex
CREATE INDEX "ProductGroup_assemblyGroupId_idx" ON "ProductGroup"("assemblyGroupId");

-- CreateIndex
CREATE INDEX "ProductGroup_name_trgm_idx" ON "ProductGroup" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Part_partNumberNorm_idx" ON "Part"("partNumberNorm");

-- CreateIndex
CREATE INDEX "Part_productGroupId_idx" ON "Part"("productGroupId");

-- CreateIndex
CREATE INDEX "Part_assemblyGroupId_idx" ON "Part"("assemblyGroupId");

-- CreateIndex
CREATE INDEX "Part_partNumberNorm_trgm_idx" ON "Part" USING GIN ("partNumberNorm" gin_trgm_ops);

-- CreateIndex
CREATE UNIQUE INDEX "Part_brandId_partNumberNorm_key" ON "Part"("brandId", "partNumberNorm");

-- CreateIndex
CREATE INDEX "OeNumber_numberNorm_idx" ON "OeNumber"("numberNorm");

-- CreateIndex
CREATE INDEX "OeNumber_numberNorm_trgm_idx" ON "OeNumber" USING GIN ("numberNorm" gin_trgm_ops);

-- CreateIndex
CREATE UNIQUE INDEX "OeNumber_partId_numberNorm_key" ON "OeNumber"("partId", "numberNorm");

-- CreateIndex
CREATE INDEX "CrossReference_numberNorm_idx" ON "CrossReference"("numberNorm");

-- CreateIndex
CREATE INDEX "CrossReference_numberNorm_trgm_idx" ON "CrossReference" USING GIN ("numberNorm" gin_trgm_ops);

-- CreateIndex
CREATE UNIQUE INDEX "CrossReference_partId_brandName_numberNorm_type_key" ON "CrossReference"("partId", "brandName", "numberNorm", "type");

-- CreateIndex
CREATE INDEX "Fitment_vehicleTypeId_idx" ON "Fitment"("vehicleTypeId");

-- CreateIndex
CREATE INDEX "RecentSearch_userKey_updatedAt_idx" ON "RecentSearch"("userKey", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RecentSearch_userKey_manufacturerId_key" ON "RecentSearch"("userKey", "manufacturerId");

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleType" ADD CONSTRAINT "VehicleType_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductGroup" ADD CONSTRAINT "ProductGroup_assemblyGroupId_fkey" FOREIGN KEY ("assemblyGroupId") REFERENCES "AssemblyGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Part" ADD CONSTRAINT "Part_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Part" ADD CONSTRAINT "Part_productGroupId_fkey" FOREIGN KEY ("productGroupId") REFERENCES "ProductGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Part" ADD CONSTRAINT "Part_assemblyGroupId_fkey" FOREIGN KEY ("assemblyGroupId") REFERENCES "AssemblyGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OeNumber" ADD CONSTRAINT "OeNumber_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OeNumber" ADD CONSTRAINT "OeNumber_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrossReference" ADD CONSTRAINT "CrossReference_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fitment" ADD CONSTRAINT "Fitment_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fitment" ADD CONSTRAINT "Fitment_vehicleTypeId_fkey" FOREIGN KEY ("vehicleTypeId") REFERENCES "VehicleType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentSearch" ADD CONSTRAINT "RecentSearch_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

