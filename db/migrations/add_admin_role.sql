-- Add admin role and permissions to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Add initial admin user if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE username = 'ayomide@sixpoint.io') THEN
        INSERT INTO users (username, display_name, is_admin)
        VALUES ('ayomide@sixpoint.io', 'Ayomide Bakre', TRUE);
    ELSE
        UPDATE users SET is_admin = TRUE WHERE username = 'ayomide@sixpoint.io';
    END IF;
END
$$; 