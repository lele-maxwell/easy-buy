-- Add default categories
INSERT INTO categories (id, name, description, created_at, updated_at)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Electronics', 'Latest gadgets and electronic devices', NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222222', 'Gaming', 'Gaming consoles, accessories, and games', NOW(), NOW()),
    ('33333333-3333-3333-3333-333333333333', 'Audio', 'Headphones, speakers, and audio equipment', NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444444', 'Computers', 'Laptops, desktops, and computer accessories', NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555555', 'Mobile Devices', 'Smartphones, tablets, and mobile accessories', NOW(), NOW()),
    ('66666666-6666-6666-6666-666666666666', 'Smart Home', 'Smart home devices and automation solutions', NOW(), NOW())
ON CONFLICT (name) DO NOTHING; 