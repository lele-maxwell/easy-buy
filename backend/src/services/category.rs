use crate::models::category::{Category, CreateCategory, UpdateCategoryRequest};
use axum::{extract::{Path, State}, http::StatusCode, Json};
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

//delete category 
pub async fn soft_delete_category(pool: &PgPool, category_id: Uuid) -> Result<(), sqlx::Error> {
    let now = Utc::now();
    let query = "
        UPDATE categories
        SET deleted_at = $1
        WHERE id = $2 AND deleted_at IS NULL
    ";

    let result = sqlx::query(query)
        .bind(now)
        .bind(category_id)
        .execute(pool)
        .await?;

    if result.rows_affected() == 0 {
        return Err(sqlx::Error::RowNotFound);
    }

    Ok(())
}


// get category by id 
pub async fn get_category_by_id_handler(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<Json<Category>, (StatusCode, String)> {
    let result = sqlx::query_as!(
        Category,
        r#"
        SELECT id, name, description, created_at, updated_at
        FROM categories
        WHERE id = $1
        "#,
        id
    )
    .fetch_one(&pool)
    .await;

    match result {
        Ok(category) => Ok(Json(category)),
        Err(sqlx::Error::RowNotFound) => Err((StatusCode::NOT_FOUND, "Category not found".to_string())),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, format!("Database error: {}", e))),
    }
}


pub async fn update_category_handler(
    Path(id): Path<Uuid>,
    State(pool): State<PgPool>,
    Json(payload): Json<UpdateCategoryRequest>,
) -> Result<Json<String>, (StatusCode, String)> {
    let result = sqlx::query!(
        r#"
        UPDATE categories
        SET name = COALESCE($1, name),
            description = COALESCE($2, description),
            updated_at = NOW()
        WHERE id = $3 AND deleted_at IS NULL
        "#,
        payload.name,
        payload.description,
        id
    )
    .execute(&pool)
    .await;

    match result {
        Ok(res) if res.rows_affected() == 1 => Ok(Json("Category updated successfully".to_string())),
        Ok(_) => Err((StatusCode::NOT_FOUND, "Category not found".into())),
        Err(err) => Err((StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to update: {}", err))),
    }
}
