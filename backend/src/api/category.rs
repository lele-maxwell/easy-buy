use crate::services::category::{filter_categories_handler, get_category_by_id_handler, update_category_handler};
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{delete, get, patch, post},
    Json, Router
};
use sqlx::PgPool;
use uuid::Uuid;
use crate::{
    models::category::CreateCategory,
    services::category::{create_category, list_categories},
};

pub fn category_routes() -> Router<PgPool> {
    Router::new()
        .route("/create", post(create_category_handler))
        .route("/:id", get(get_category_by_id_handler))
        .route("/list", get(list_categories_handler))
        .route("/update/:id", patch(update_category_handler))
        .route("/delete/soft/:id", patch(soft_delete_category_handler))
        .route("/filter", get(filter_categories_handler))
        .route("/delete/hard/:id", delete(hard_delete_category_handler))
}

pub async fn create_category_handler(
    State(pool): State<PgPool>,
    Json(payload): Json<CreateCategory>,
) -> Result<Json<impl serde::Serialize>, (StatusCode, String)> {
    let category = create_category(&pool, payload)
        .await
        .map_err(|err| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB error: {}", err)))?;

    Ok(Json(category))
}

pub async fn list_categories_handler(
    State(pool): State<PgPool>,
) -> Result<Json<impl serde::Serialize>, (StatusCode, String)> {
    let categories = list_categories(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(categories))
}

pub async fn soft_delete_category_handler(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, StatusCode> {
    let result = sqlx::query!(
        r#"
        UPDATE categories
        SET is_deleted = TRUE, updated_at = NOW()
        WHERE id = $1
        "#,
        id
    )
    .execute(&pool)
    .await;

    match result {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

pub async fn hard_delete_category_handler(
    Path(id): Path<Uuid>,
    State(pool): State<PgPool>,
) -> impl IntoResponse {
    let result = sqlx::query!(
        "DELETE FROM categories WHERE id = $1",
        id
    )
    .execute(&pool)
    .await;

    match result {
        Ok(res) => {
            if res.rows_affected() == 0 {
                (
                    StatusCode::NOT_FOUND,
                    Json("Category not found".to_string()),
                )
            } else {
                (
                    StatusCode::OK,
                    Json("Category deleted successfully".to_string()),
                )
            }
        }
        Err(err) => {
            eprintln!("Failed to delete category: {:?}", err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json("Failed to delete category".to_string()),
            )
        }
    }
}
 