-- Add OAuth fields to users table
ALTER TABLE users
ALTER COLUMN password DROP NOT NULL,
ADD COLUMN IF NOT EXISTS oauth_provider TEXT,
ADD COLUMN IF NOT EXISTS oauth_id TEXT,
ADD COLUMN IF NOT EXISTS display_name TEXT; 