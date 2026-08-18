CREATE TABLE `maintenanceJobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobKey` varchar(100) NOT NULL,
	`scheduleCronTaskUid` varchar(65),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `maintenanceJobs_id` PRIMARY KEY(`id`),
	CONSTRAINT `maintenanceJobs_jobKey_unique` UNIQUE(`jobKey`),
	CONSTRAINT `maintenanceJobs_scheduleCronTaskUid_unique` UNIQUE(`scheduleCronTaskUid`)
);
