-- CreateTable
CREATE TABLE "public"."Santri" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "kelas" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Santri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Hafalan" (
    "id" TEXT NOT NULL,
    "santriId" TEXT NOT NULL,
    "surat" TEXT NOT NULL,
    "ayat" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Hafalan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Santri_nis_key" ON "public"."Santri"("nis");

-- AddForeignKey
ALTER TABLE "public"."Hafalan" ADD CONSTRAINT "Hafalan_santriId_fkey" FOREIGN KEY ("santriId") REFERENCES "public"."Santri"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
