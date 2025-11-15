-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('cart', 'confirmed', 'completed', 'cancelled');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "guestSessionId" TEXT,
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'confirmed';
