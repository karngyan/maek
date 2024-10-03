CREATE TABLE IF NOT EXISTS `user` (
    `id` bigint unsigned AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `name` varchar(255) NOT NULL DEFAULT '' ,
    `email` varchar(255) NOT NULL DEFAULT ''  UNIQUE,
    `verified` bool NOT NULL DEFAULT FALSE ,
    `created` bigint NOT NULL DEFAULT 0 ,
    `updated` bigint NOT NULL DEFAULT 0
) ENGINE = InnoDB
  CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
