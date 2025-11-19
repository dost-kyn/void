-- DropForeignKey
ALTER TABLE `chat` DROP FOREIGN KEY `Chat_user1_id_fkey`;

-- DropForeignKey
ALTER TABLE `chat` DROP FOREIGN KEY `Chat_user2_id_fkey`;

-- DropForeignKey
ALTER TABLE `friends` DROP FOREIGN KEY `Friends_user1_id_fkey`;

-- DropForeignKey
ALTER TABLE `friends` DROP FOREIGN KEY `Friends_user2_id_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_chat_id_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_sender_id_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `post_image` DROP FOREIGN KEY `Post_image_post_id_fkey`;

-- DropIndex
DROP INDEX `Chat_user1_id_fkey` ON `chat`;

-- DropIndex
DROP INDEX `Chat_user2_id_fkey` ON `chat`;

-- DropIndex
DROP INDEX `Friends_user1_id_fkey` ON `friends`;

-- DropIndex
DROP INDEX `Friends_user2_id_fkey` ON `friends`;

-- DropIndex
DROP INDEX `Message_chat_id_fkey` ON `message`;

-- DropIndex
DROP INDEX `Message_sender_id_fkey` ON `message`;

-- DropIndex
DROP INDEX `Post_category_id_fkey` ON `post`;

-- DropIndex
DROP INDEX `Post_user_id_fkey` ON `post`;

-- DropIndex
DROP INDEX `Post_image_post_id_fkey` ON `post_image`;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post_image` ADD CONSTRAINT `Post_image_post_id_fkey` FOREIGN KEY (`post_id`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_user1_id_fkey` FOREIGN KEY (`user1_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friends` ADD CONSTRAINT `Friends_user2_id_fkey` FOREIGN KEY (`user2_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_user1_id_fkey` FOREIGN KEY (`user1_id`) REFERENCES `Friends`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_user2_id_fkey` FOREIGN KEY (`user2_id`) REFERENCES `Friends`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_chat_id_fkey` FOREIGN KEY (`chat_id`) REFERENCES `Chat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
