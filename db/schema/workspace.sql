CREATE TABLE IF NOT EXISTS workspace
(
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL DEFAULT '',
    description TEXT         NOT NULL,
    created     BIGINT       NOT NULL DEFAULT 0,
    updated     BIGINT       NOT NULL DEFAULT 0
);
