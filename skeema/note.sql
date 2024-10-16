CREATE TABLE IF NOT EXISTS `note`
(
    `id`            bigint unsigned AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `content`       longtext                       NOT NULL,
    `favorite`      bool                           NOT NULL DEFAULT FALSE,
    `deleted`       bool                           NOT NULL DEFAULT FALSE,
    `trashed`       bool                           NOT NULL DEFAULT FALSE,
    `workspace_id`  bigint unsigned                NOT NULL,
    `created`       bigint                         NOT NULL DEFAULT 0,
    `updated`       bigint                         NOT NULL DEFAULT 0,
    `created_by_id` bigint unsigned                NOT NULL,
    `updated_by_id` bigint unsigned                NOT NULL

) ENGINE = InnoDB
  CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;