CREATE TABLE IF NOT EXISTS `workspace` (
    `id`            bigint unsigned AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `name`          varchar(255) NOT NULL DEFAULT '',
    `description`   text NOT NULL,
    `created`       bigint NOT NULL DEFAULT 0,
    `updated`       bigint NOT NULL DEFAULT 0
) ENGINE=InnoDB
  CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
