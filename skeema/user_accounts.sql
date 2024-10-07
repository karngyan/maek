CREATE TABLE IF NOT EXISTS `user_accounts` (
    `id`            bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `user_id`       bigint unsigned NOT NULL,
    `account_id`    bigint unsigned NOT NULL
) ENGINE=InnoDB
  CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
