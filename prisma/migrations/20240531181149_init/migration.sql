-- CreateTable
CREATE TABLE "species" (
    "id" TEXT NOT NULL,
    "scientificName" TEXT NOT NULL DEFAULT '',
    "commonName" TEXT NOT NULL DEFAULT '',
    "volumeM3" INTEGER NOT NULL DEFAULT 0,
    "sectionsVolumeM3" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tree" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "scientificName" TEXT NOT NULL,
    "commonName" TEXT NOT NULL,
    "range" INTEGER NOT NULL DEFAULT 0,
    "dap" INTEGER NOT NULL DEFAULT 0,
    "meters" INTEGER NOT NULL DEFAULT 0,
    "volumeM3" INTEGER NOT NULL DEFAULT 0,
    "sectionsVolumeM3" INTEGER NOT NULL DEFAULT 0,
    "specie_id" TEXT NOT NULL,

    CONSTRAINT "tree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL DEFAULT '',
    "section" TEXT NOT NULL DEFAULT '',
    "d1" INTEGER NOT NULL DEFAULT 0,
    "d2" INTEGER NOT NULL DEFAULT 0,
    "d3" INTEGER NOT NULL DEFAULT 0,
    "d4" INTEGER NOT NULL DEFAULT 0,
    "meters" INTEGER NOT NULL DEFAULT 0,
    "volumeM3" INTEGER NOT NULL DEFAULT 0,
    "tree_id" TEXT NOT NULL,
    "specie_id" TEXT,

    CONSTRAINT "section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch" (
    "id" TEXT NOT NULL,
    "volumeM3" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batchSection" (
    "id" TEXT NOT NULL,
    "section_id" TEXT,
    "batch_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batchSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "batchSection_section_id_batch_id_idx" ON "batchSection"("section_id", "batch_id");

-- AddForeignKey
ALTER TABLE "tree" ADD CONSTRAINT "tree_specie_id_fkey" FOREIGN KEY ("specie_id") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section" ADD CONSTRAINT "section_tree_id_fkey" FOREIGN KEY ("tree_id") REFERENCES "tree"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "section" ADD CONSTRAINT "section_specie_id_fkey" FOREIGN KEY ("specie_id") REFERENCES "species"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batchSection" ADD CONSTRAINT "batchSection_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batchSection" ADD CONSTRAINT "batchSection_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
