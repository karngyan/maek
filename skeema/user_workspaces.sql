CREATE TABLE IF NOT EXISTS `user_workspaces`
(
    `id`           bigint unsigned AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `user_id`      bigint unsigned                NOT NULL,
    `workspace_id` bigint unsigned                NOT NULL
) ENGINE = InnoDB
  CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;
