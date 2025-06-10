-- Delete existing admin user
DELETE FROM users WHERE email = 'admin@example.com';

-- Create new admin user with proper password hash (password: admin123)
INSERT INTO users (id, name, email, password_hash, role)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Admin User',
    'admin@example.com',
    '$argon2id$v=19$m=19456,t=2,p=1$c29tZXNhbHQ$RdescudvJCsgt3ub+b+dWRWJTmaaJObG',
    'admin'
); 