-- AlterTable
ALTER TABLE `post` ADD COLUMN `status` ENUM('Expectation', 'Published', 'Rejected') NOT NULL DEFAULT 'Expectation';
