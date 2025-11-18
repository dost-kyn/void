-- AlterTable
ALTER TABLE `chat` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` ADD COLUMN `status` ENUM('Not_banned', 'Ban') NOT NULL DEFAULT 'Not_banned';
