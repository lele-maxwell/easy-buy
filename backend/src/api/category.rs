
use crate::models::category::UpdateCategoryRequest;
use crate::services::category::soft_delete_category;
use axum::response::IntoResponse;
use axum::routing::delete;
use axum::{extract::Path, routing::patch};
use axum::{
    extract::State, http::StatusCode, routing::{get, post}, Json, Router
};
use sqlx::PgPool;
use uuid::Uuid;
use crate::{
    models::category::CreateCategory, services::category::{create_category, list_categories}, 
};


//categoy api routes 

pub fn category_routes() -> Router<PgPool> {
    Router::new()
    .route("/create", post(create_category_handler))
    .route("/list", get(list_categories_handler))
    .route("/delete/soft/:id", patch(soft_delete_category_handler))
    .route("/delete/hard/:id", delete(hard_delete_category_handler))
    .route("/update/:id", patch(update_category_handler))
    
    
}





// creating category handler
    pub async fn create_category_handler(
        State(pool): State<PgPool>,
        Json(payload): Json<CreateCategory>,
    ) -> Result<Json<impl serde::Serialize>, (StatusCode, String)> {
        let category = create_category(&pool, payload)
            .await
            .map_err(|err| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB error: {}", err)))?;
    
        Ok(Json(category))
    }


    //Listing categories 

pub async fn list_categories_handler(
    State(pool): State<PgPool>,
) -> Result<Json<impl serde::Serialize>, (StatusCode, String)> {
    let categories = list_categories(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(categories))
}


//soft delete of category 

pub async fn soft_delete_category_handler(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, StatusCode> {
    let result = sqlx::query!(
        r#"UPDATE categories SET deleted_at = NOW() WHERE id = $1"#,
        id
    )
    .execute(&pool)
    .await;

    match result {
        Ok(_) => Ok(StatusCode::NO_CONTENT),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

// hard delete 


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


// update category info


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


