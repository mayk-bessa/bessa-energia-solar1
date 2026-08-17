CREATE TABLE `chargingProposals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sellerId` int NOT NULL,
	`sellerName` varchar(255) NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`clientEmail` varchar(320),
	`clientPhone` varchar(20),
	`componentsJson` text NOT NULL,
	`totalCents` int NOT NULL,
	`status` enum('draft','sent') NOT NULL DEFAULT 'draft',
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chargingProposals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','seller','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `chargingProposals` ADD CONSTRAINT `chargingProposals_sellerId_users_id_fk` FOREIGN KEY (`sellerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;