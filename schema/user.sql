CREATE TABLE IF NOT EXISTS "user"
(
    id                   BIGSERIAL PRIMARY KEY,
    default_workspace_id BIGINT       NOT NULL DEFAULT 0,
    name                 VARCHAR(255) NOT NULL DEFAULT '',
    email                VARCHAR(255) NOT NULL DEFAULT '' UNIQUE,
    role                 VARCHAR(255) NOT NULL DEFAULT 'user',
    password             TEXT         NOT NULL,
    verified             BOOLEAN      NOT NULL DEFAULT FALSE,
    created              BIGINT       NOT NULL DEFAULT 0,
    updated              BIGINT       NOT NULL DEFAULT 0
);