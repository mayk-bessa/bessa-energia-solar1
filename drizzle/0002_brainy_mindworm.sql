CREATE TABLE `budgetRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`clientEmail` varchar(320) NOT NULL,
	`clientPhone` varchar(20) NOT NULL,
	`status` enum('new','contacted','proposal_sent','closed','rejected') NOT NULL DEFAULT 'new',
	`estimatedMonthlySpend` int,
	`notes` text,
	`source` varchar(50) DEFAULT 'website',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `budgetRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `technicalVisits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`budgetRequestId` int NOT NULL,
	`scheduledDate` timestamp NOT NULL,
	`status` enum('scheduled','completed','cancelled','rescheduled') NOT NULL DEFAULT 'scheduled',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `technicalVisits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `technicalVisits` ADD CONSTRAINT `technicalVisits_budgetRequestId_budgetRequests_id_fk` FOREIGN KEY (`budgetRequestId`) REFERENCES `budgetRequests`(`id`) ON DELETE no action ON UPDATE no action;