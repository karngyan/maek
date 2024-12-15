CREATE TABLE IF NOT EXISTS `collection`
(
    `id`            bigint unsigned AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `name`          varchar(255)                   NOT NULL DEFAULT '',
    `description`   text                           NOT NULL,
    `created`       bigint                         NOT NULL DEFAULT 0,
    `updated`       bigint                         NOT NULL DEFAULT 0,
    `trashed`       bool                           NOT NULL DEFAULT FALSE,
    `deleted`       bool                           NOT NULL DEFAULT FALSE,
    `workspace_id`  bigint unsigned                NOT NULL,
    `created_by_id` bigint unsigned                NOT NULL,
    `updated_by_id` bigint unsigned                NOT NULL
) ENGINE = InnoDB
  CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;
