-- Update admin user's password hash (password: admin123)
UPDATE users 
SET password_hash = '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$RdescudvJCsgt3ub+b+dWRWJTmaaJObG'
WHERE email = 'admin@example.com'; 