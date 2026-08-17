UPDATE `chargingProposals` SET `status` = 'pending' WHERE `status` IN ('draft', 'sent');
--> statement-breakpoint
ALTER TABLE `chargingProposals` MODIFY COLUMN `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending';
