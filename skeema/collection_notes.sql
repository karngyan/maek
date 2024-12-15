CREATE TABLE IF NOT EXISTS `collection_notes`
(
    `id`            bigint unsigned AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `collection_id` bigint unsigned                NOT NULL,
    `note_id`       bigint unsigned                NOT NULL
) ENGINE = InnoDB
  CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;
