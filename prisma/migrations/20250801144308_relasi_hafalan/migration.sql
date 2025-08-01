/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Hafalan` table. All the data in the column will be lost.
  - You are about to drop the column `nis` on the `Santri` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Santri_nis_key";

-- AlterTable
ALTER TABLE "public"."Hafalan" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "public"."Santri" DROP COLUMN "nis";
