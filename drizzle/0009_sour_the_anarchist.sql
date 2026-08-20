ALTER TABLE `reviews` ADD `verifiedAt` timestamp;--> statement-breakpoint
ALTER TABLE `reviews` ADD `verifiedBy` int;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_verifiedBy_users_id_fk` FOREIGN KEY (`verifiedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;