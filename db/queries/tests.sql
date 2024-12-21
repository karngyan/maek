-- name: TruncateAllTables :exec
DO $$ DECLARE
    rec RECORD;
BEGIN
    -- Dynamically truncate all tables in the current schema which is the first value in search_path
    FOR rec IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(rec.tablename) || ' RESTART IDENTITY CASCADE';
    END LOOP;

END $$;