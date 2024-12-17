CREATE TABLE IF NOT EXISTS "session"
(
    id      BIGSERIAL PRIMARY KEY,
    ua      VARCHAR(255) NOT NULL DEFAULT '',
    ip      VARCHAR(255) NOT NULL DEFAULT '',
    user_id BIGINT       NOT NULL,
    token   VARCHAR(255) NOT NULL DEFAULT '',
    expires BIGINT       NOT NULL DEFAULT 0,
    created BIGINT       NOT NULL DEFAULT 0,
    updated BIGINT       NOT NULL DEFAULT 0
);

-- Index for looking up sessions by token
CREATE INDEX idx_session_token
    ON "session" (token);

-- Index for user's sessions
CREATE INDEX idx_session_user
    ON "session" (user_id);

