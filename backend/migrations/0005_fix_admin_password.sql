-- Delete existing admin user
DELETE FROM users WHERE email = 'admin@example.com';

-- Create new admin user with password hash generated using Argon2::default()
INSERT INTO users (id, name, email, password_hash, role)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Admin User',
    'admin@example.com',
    '$argon2id$v=19$m=19456,t=2,p=1$WKyhqQ37LHziQ6G5zh+irw$TBWw8wKkv50iu4KZNBi2YsHw368cliVydd2t8Unt51U',
    'admin'
); 