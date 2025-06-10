use sqlx::PgPool;
use uuid::Uuid;
use crate::models::product_image::{ProductImage, CreateProductImage, UpdateProductImage};

pub async fn create_product_image(
    pool: &PgPool,
    image: CreateProductImage,
) -> Result<ProductImage, sqlx::Error> {
    // If this is marked as primary, unset any existing primary images
    if image.is_primary.unwrap_or(false) {
        sqlx::query!(
            "UPDATE product_images SET is_primary = false WHERE product_id = $1",
            image.product_id
        )
        .execute(pool)
        .await?;
    }

    let product_image = sqlx::query_as!(
        ProductImage,
        r#"
        INSERT INTO product_images (product_id, image_url, is_primary)
        VALUES ($1, $2, $3)
        RETURNING *
        "#,
        image.product_id,
        image.image_url,
        image.is_primary.unwrap_or(false)
    )
    .fetch_one(pool)
    .await?;

    Ok(product_image)
}

pub async fn get_product_images(
    pool: &PgPool,
    product_id: Uuid,
) -> Result<Vec<ProductImage>, sqlx::Error> {
    let images = sqlx::query_as!(
        ProductImage,
        "SELECT * FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC, created_at ASC",
        product_id
    )
    .fetch_all(pool)
    .await?;

    Ok(images)
}

pub async fn update_product_image(
    pool: &PgPool,
    image_id: Uuid,
    update: UpdateProductImage,
) -> Result<ProductImage, sqlx::Error> {
    // If setting as primary, unset any existing primary images for this product
    if update.is_primary.unwrap_or(false) {
        let image = sqlx::query_as!(
            ProductImage,
            "SELECT * FROM product_images WHERE id = $1",
            image_id
        )
        .fetch_one(pool)
        .await?;

        sqlx::query!(
            "UPDATE product_images SET is_primary = false WHERE product_id = $1 AND id != $2",
            image.product_id,
            image_id
        )
        .execute(pool)
        .await?;
    }

    let product_image = sqlx::query_as!(
        ProductImage,
        r#"
        UPDATE product_images
        SET is_primary = COALESCE($1, is_primary)
        WHERE id = $2
        RETURNING *
        "#,
        update.is_primary,
        image_id
    )
    .fetch_one(pool)
    .await?;

    Ok(product_image)
}

pub async fn delete_product_image(
    pool: &PgPool,
    image_id: Uuid,
) -> Result<(), sqlx::Error> {
    sqlx::query!("DELETE FROM product_images WHERE id = $1", image_id)
        .execute(pool)
        .await?;

    Ok(())
} 