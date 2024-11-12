/*
  Warnings:

  - The values [VENTAs] on the enum `RealStateStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RealStateStatus_new" AS ENUM ('VENTAS', 'ALQUILER', 'SUBASTA');
ALTER TABLE "RealState" ALTER COLUMN "status" TYPE "RealStateStatus_new" USING ("status"::text::"RealStateStatus_new");
ALTER TYPE "RealStateStatus" RENAME TO "RealStateStatus_old";
ALTER TYPE "RealStateStatus_new" RENAME TO "RealStateStatus";
DROP TYPE "RealStateStatus_old";
COMMIT;
