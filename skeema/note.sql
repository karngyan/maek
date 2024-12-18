CREATE TABLE IF NOT EXISTS `note`
(
    `id`                bigint unsigned AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `uuid`              varchar(100)                   NOT NULL UNIQUE,
    `content`           longtext                       NOT NULL,
    `favorite`          bool                           NOT NULL DEFAULT FALSE,
    `deleted`           bool                           NOT NULL DEFAULT FALSE,
    `trashed`           bool                           NOT NULL DEFAULT FALSE,
    `has_content`       bool                           NOT NULL DEFAULT FALSE,
    `has_images`        bool                           NOT NULL DEFAULT FALSE,
    `has_videos`        bool                           NOT NULL DEFAULT FALSE,
    `has_open_tasks`    bool                           NOT NULL DEFAULT FALSE,
    `has_closed_tasks`  bool                           NOT NULL DEFAULT FALSE,
    `has_code`          bool                           NOT NULL DEFAULT FALSE,
    `has_audios`        bool                           NOT NULL DEFAULT FALSE,
    `has_links`         bool                           NOT NULL DEFAULT FALSE,
    `has_files`         bool                           NOT NULL DEFAULT FALSE,
    `has_quotes`        bool                           NOT NULL DEFAULT FALSE,
    `has_tables`        bool                           NOT NULL DEFAULT FALSE,
    `workspace_id`      bigint unsigned                NOT NULL,
    `created`           bigint                         NOT NULL DEFAULT 0,
    `updated`           bigint                         NOT NULL DEFAULT 0,
    `created_by_id`     bigint unsigned                NOT NULL,
    `updated_by_id`     bigint unsigned                NOT NULL

) ENGINE = InnoDB
  CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;
