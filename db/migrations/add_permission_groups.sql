-- Create permission groups table
CREATE TABLE IF NOT EXISTS permission_groups (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions JSONB DEFAULT '[]',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create junction table for users and permission groups
CREATE TABLE IF NOT EXISTS user_permission_groups (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  group_id INTEGER NOT NULL REFERENCES permission_groups(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, group_id)
);

-- Add default permission groups
DO $$
BEGIN
    -- Create internal permission group with full permissions
    IF NOT EXISTS (SELECT 1 FROM permission_groups WHERE name = 'Internal') THEN
        INSERT INTO permission_groups (name, description, permissions, is_default)
        VALUES (
            'Internal', 
            'Internal users with full access to system features', 
            '["view_users", "manage_users", "view_deals", "manage_deals", "view_analytics"]',
            TRUE
        );
    END IF;

    -- Create external permission group with limited permissions
    IF NOT EXISTS (SELECT 1 FROM permission_groups WHERE name = 'External') THEN
        INSERT INTO permission_groups (name, description, permissions, is_default)
        VALUES (
            'External', 
            'External users with limited access to system features', 
            '["view_deals", "view_analytics"]',
            FALSE
        );
    END IF;
    
    -- Assign all existing users to the Internal group
    INSERT INTO user_permission_groups (user_id, group_id)
    SELECT u.id, pg.id 
    FROM users u, permission_groups pg
    WHERE pg.name = 'Internal'
    AND NOT EXISTS (
        SELECT 1 FROM user_permission_groups upg 
        WHERE upg.user_id = u.id AND upg.group_id = pg.id
    );
END
$$; 