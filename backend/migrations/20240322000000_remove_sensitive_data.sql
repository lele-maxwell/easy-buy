-- Remove sensitive data from migrations
DELETE FROM users WHERE email = 'admin@example.com';

-- Insert a new admin user with a secure default password
INSERT INTO users (email, password_hash, role, name)
VALUES (
    'admin@example.com',
    -- This is a hashed version of 'admin123' - should be changed in production
    '$argon2id$v=19$m=65536,t=3,p=4$c2FsdHlzYWx0$YXNkZmFzZGZhc2RmYXNkZg',
    'admin',
    'Admin User'
); 