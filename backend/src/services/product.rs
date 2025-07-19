use crate::models::product::{CreateProduct, Product, UpdateProduct};
use sqlx::PgPool;
use uuid::Uuid;
use chrono::{Utc, DateTime};
use chrono::NaiveDateTime;

pub async fn create_product(pool: &PgPool, new_product: CreateProduct) -> Result<Product, sqlx::Error> {
    let created_at = Utc::now().naive_utc();
    let updated_at = created_at;

    let rec = sqlx::query_as_unchecked!(
        Product,
        r#"
        INSERT INTO products (id, name, description, price, stock_quantity, created_at, updated_at, category_id, deleted_at, images)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, name, description, price, stock_quantity, category_id, created_at, updated_at, deleted_at, images
        "#,
        Uuid::new_v4(), 
        new_product.name, 
        new_product.description, 
        new_product.price,
        new_product.stock_quantity,
        created_at,
        updated_at,
        new_product.category_id,
        None as Option<NaiveDateTime>,
        None as Option<Vec<String>>
    )
    .fetch_one(pool)
    .await?;

    Ok(rec)
}

// udate product 
pub async fn update_product(
    pool: &PgPool,
    id: Uuid,
    update: UpdateProduct,
) -> Result<Product, sqlx::Error> {
    let current_time = Utc::now().naive_utc();

    let product = sqlx::query_as_unchecked!(
        Product,
        r#"
        UPDATE products
        SET name = $1, description = $2, price = $3, stock_quantity = $4, category_id = $5, deleted_at = $6, images = $7
        WHERE id = $8
        RETURNING id, name, description, price, stock_quantity, category_id, created_at, updated_at, deleted_at, images
        "#,
        update.name,
        update.description,
        update.price,
        update.stock_quantity,
        update.category_id,
        update.deleted_at,
        update.images.as_deref(),
        id
    )
    .fetch_one(pool)
    .await?;

    Ok(product)
}

// delete a product from data base (hard delete )
pub async fn delete_product(pool: &PgPool, id: Uuid) -> Result<(), sqlx::Error> {
    sqlx::query!(
        "DELETE FROM products WHERE id = $1",
        id
    )
    .execute(pool)
    .await?;

    Ok(())
}

//soft delete 
pub async fn soft_delete_product(pool: &PgPool, id: Uuid) -> Result<(), sqlx::Error> {
    let now: DateTime<Utc> = Utc::now();
    sqlx::query!(
        "UPDATE products SET deleted_at = $1 WHERE id = $2",
        now,
        id
    )
    .execute(pool)
    .await?;

    Ok(())
}

pub async fn add_product_image(pool: &PgPool, product_id: Uuid, image_url: String) -> Result<(), sqlx::Error> {
    sqlx::query!(
        r#"
        UPDATE products 
        SET images = COALESCE(images, ARRAY[]::text[]) || $1::text
        WHERE id = $2
        "#,
        image_url,
        product_id
    )
    .execute(pool)
    .await?;

    Ok(())
}
