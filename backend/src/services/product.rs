use crate::models::product::{CreateProduct, Product, UpdateProduct};
use sqlx::PgPool;
use uuid::Uuid;
use chrono::Utc;

pub async fn create_product(pool: &PgPool, new_product: CreateProduct) -> Result<Product, sqlx::Error> {
    let created_at = Utc::now().naive_utc();
    let updated_at = created_at;

    let rec = sqlx::query_as_unchecked!(
        Product,
        r#"
        INSERT INTO products (id, name, description, price, stock_quantity, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, description, price, stock_quantity, created_at, updated_at
        "#,
        Uuid::new_v4(), 
        new_product.name, 
        new_product.description, 
        new_product.price,
        new_product.stock_quantity,
        created_at,
        updated_at
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

    let product = sqlx::query_as!(
        Product,
        r#"
        UPDATE products
        SET
            name = COALESCE($1, name),
            description = COALESCE($2, description),
            price = COALESCE($3, price),
            stock_quantity = COALESCE($4, stock_quantity),
            updated_at = $5
        WHERE id = $6
        RETURNING id, name, description, price, stock_quantity, created_at, updated_at
        "#,
        update.name,
        update.description,
        update.price,
        update.stock_quantity,
        current_time,
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
    let now = Utc::now().naive_utc();
    sqlx::query!(
        "UPDATE products SET deleted_at = $1 WHERE id = $2",
        now,
        id
    )
    .execute(pool)
    .await?;

    Ok(())
}
