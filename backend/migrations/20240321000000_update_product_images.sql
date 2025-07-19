-- Update product_images table
ALTER TABLE product_images
ADD COLUMN IF NOT EXISTS is_primary BOOLEAN NOT NULL DEFAULT false;

-- Create index on product_id if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'product_images' 
        AND indexname = 'idx_product_images_product_id'
    ) THEN
        CREATE INDEX idx_product_images_product_id ON product_images(product_id);
    END IF;
END $$;

-- Create or replace the update_updated_at function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS set_updated_at ON product_images;

-- Create the trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON product_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at(); 