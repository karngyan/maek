CREATE TABLE IF NOT EXISTS `session` (
    `id`        bigint unsigned AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `ua`        varchar(255) NOT NULL DEFAULT '',
    `ip`        varchar(255) NOT NULL DEFAULT '',
    `user_id`   bigint unsigned NOT NULL,
    `token`     varchar(255) NOT NULL DEFAULT '',
    `expires`   bigint NOT NULL DEFAULT 0 ,
    `created`   bigint NOT NULL DEFAULT 0 ,
    `updated`   bigint NOT NULL DEFAULT 0
) ENGINE=InnoDB
  CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;