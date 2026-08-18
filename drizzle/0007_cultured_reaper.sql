CREATE TABLE `proposalDeletionAudits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`proposalId` int NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`sellerId` int NOT NULL,
	`deletedBy` int NOT NULL,
	`deletedByName` varchar(255) NOT NULL,
	`reason` varchar(500),
	`deletedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `proposalDeletionAudits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `proposalGoals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sellerId` int NOT NULL,
	`month` varchar(7) NOT NULL,
	`targetProposals` int NOT NULL DEFAULT 0,
	`targetCents` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `proposalGoals_id` PRIMARY KEY(`id`),
	CONSTRAINT `proposalGoals_seller_month_unique` UNIQUE(`sellerId`,`month`)
);
--> statement-breakpoint
ALTER TABLE `chargingProposals` ADD `projectType` enum('solar','ev_charging','hybrid') DEFAULT 'ev_charging' NOT NULL;--> statement-breakpoint
ALTER TABLE `chargingProposals` ADD `coverArt` varchar(64) DEFAULT 'solar-home-vehicle' NOT NULL;--> statement-breakpoint
ALTER TABLE `chargingProposals` ADD `validUntil` timestamp;--> statement-breakpoint
ALTER TABLE `chargingProposals` ADD `signatureToken` varchar(96);--> statement-breakpoint
ALTER TABLE `chargingProposals` ADD `signedAt` timestamp;--> statement-breakpoint
ALTER TABLE `chargingProposals` ADD `signedByName` varchar(255);--> statement-breakpoint
ALTER TABLE `chargingProposals` ADD `signedByEmail` varchar(320);--> statement-breakpoint
ALTER TABLE `chargingProposals` ADD `deletedAt` timestamp;--> statement-breakpoint
ALTER TABLE `chargingProposals` ADD `deletedBy` int;--> statement-breakpoint
ALTER TABLE `chargingProposals` ADD `deletionReason` varchar(500);--> statement-breakpoint
ALTER TABLE `chargingProposals` ADD CONSTRAINT `chargingProposals_signatureToken_unique` UNIQUE(`signatureToken`);--> statement-breakpoint
ALTER TABLE `proposalGoals` ADD CONSTRAINT `proposalGoals_sellerId_users_id_fk` FOREIGN KEY (`sellerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `chargingProposals` ADD CONSTRAINT `chargingProposals_deletedBy_users_id_fk` FOREIGN KEY (`deletedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;