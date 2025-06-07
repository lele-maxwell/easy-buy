-- Update admin user's password hash with correct Argon2 parameters (password: admin123)
UPDATE users 
SET password_hash = '$argon2id$v=19$m=19456,t=2,p=1$c29tZXNhbHQ$RdescudvJCsgt3ub+b+dWRWJTmaaJObG'
WHERE email = 'admin@example.com'; 