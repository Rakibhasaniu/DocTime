-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "isDeleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "needsPasswordChage" SET DEFAULT true,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
