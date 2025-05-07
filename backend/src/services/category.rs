use crate::models::category::{Category, CreateCategory, UpdateCategory};
use sqlx::PgPool;
use uuid::Uuid;
use chrono::Utc;
 

 // creating new category
pub async fn create_category(pool: &PgPool, data: CreateCategory) -> Result<Category, sqlx::Error> {
    let now = Utc::now().naive_utc();
    let id = Uuid::new_v4();

    let rec = sqlx::query_as!(
        Category,
        r#"
        INSERT INTO categories (id, name, description, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, description, created_at, updated_at
        "#,
        id,
        data.name,
        data.description,
        now,
        now
    )
    .fetch_one(pool)
    .await?;

    Ok(rec)
}

// listing categories


pub async fn list_categories(pool: &PgPool) -> Result<Vec<Category>, sqlx::Error> {
    let categories = sqlx::query_as!(
        Category,
        r#"
        SELECT id, name, description, created_at, updated_at
        FROM categories
        WHERE deleted_at IS NULL
        ORDER BY created_at DESC
        "#
    )
    .fetch_all(pool)
    .await?;

    Ok(categories)
}
