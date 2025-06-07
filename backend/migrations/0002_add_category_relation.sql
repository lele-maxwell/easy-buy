-- Add category_id to products table
ALTER TABLE products
ADD COLUMN category_id UUID REFERENCES categories(id);

-- Drop the old category column
ALTER TABLE products
DROP COLUMN category; 