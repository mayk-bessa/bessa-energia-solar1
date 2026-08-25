ALTER TABLE `localAccounts` ADD `totpSecretEncrypted` varchar(512);--> statement-breakpoint
ALTER TABLE `localAccounts` ADD `totpPendingSecretEncrypted` varchar(512);--> statement-breakpoint
ALTER TABLE `localAccounts` ADD `totpEnabledAt` timestamp;