







use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::{delete, get, post, put},
    Json, Router,
};
use sqlx::{FromRow, PgPool};
use uuid::Uuid;

use crate::{models::product::{Product, UpdateProduct}, services::product::{create_product, delete_product, soft_delete_product, update_product}};
use crate::models::product::CreateProduct;

pub fn product_routes(pool: PgPool) -> Router<PgPool> {
    Router::new()
        .route("/:id", get(get_product))
        .route("/", post(create_product_handler))       // POST /api/product
        .route("/", get(list_products)) // GET /api/product
        .route("/:id", put(update_product_handler))
        .route("/soft/:id", delete(soft_delete_product_handler))
        .route("/:id", delete(delete_product_handler)) // DELETE /api/product/:id
        .with_state(pool) // 🛠️ This line passes PgPool as shared state

}






// creating new products 
pub async fn create_product_handler(
    State(pool): State<PgPool>,
    Json(payload): Json<CreateProduct>,
) -> Result<(StatusCode, Json<Product>), (StatusCode, String)> {
    match create_product(&pool, payload).await {
        Ok(product) => Ok((StatusCode::CREATED, Json(product))),
        Err(err) => {
            eprintln!("❌ Failed to create product: {:?}", err);
            Err((StatusCode::INTERNAL_SERVER_ERROR, "Product creation failed".to_string()))
        }
    }
}

// to get product from data base
pub async fn get_product(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<Json<Product>, (StatusCode, String)> {
    let product = sqlx::query_as::<_, Product>("SELECT * FROM products WHERE id = $1")
        .bind(id)
        .fetch_optional(&pool)
        .await
        .map_err(|e| {
            eprintln!("❌ Database error: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Database error".to_string())
        })?
        .ok_or((StatusCode::NOT_FOUND, "Product not found".to_string()))?;

    Ok(Json(product))
}


// list all products available 

pub async fn list_products(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<Product>>, (StatusCode, String)> {
    let products = sqlx::query_as::<_, Product>("SELECT * FROM products")
        .fetch_all(&pool)
        .await
        .map_err(|e| {
            eprintln!("❌ Failed to fetch products: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Database error".to_string())
        })?;

    Ok(Json(products))
}

// update product 
pub async fn update_product_handler(
    Path(id): Path<Uuid>,
    State(pool): State<PgPool>,
    Json(update): Json<UpdateProduct>,
) -> Result<Json<crate::models::product::Product>, (StatusCode, String)> {
    update_product(&pool, id, update)
        .await
        .map(Json)
        .map_err(|e| {
            eprintln!("❌ Failed to update product: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Failed to update product".to_string())
        })
}


// delete product 

pub async fn delete_product_handler(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, (StatusCode, String)> {
    delete_product(&pool, id)
        .await
        .map_err(|e| {
            eprintln!("❌ Failed to delete product: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Failed to delete product".to_string())
        })?;

    Ok(StatusCode::NO_CONTENT) // 204
}


//soft delete


pub async fn soft_delete_product_handler(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, (StatusCode, String)> {
    soft_delete_product(&pool, id).await
        .map(|_| StatusCode::NO_CONTENT)
        .map_err(|e| {
            eprintln!("❌ Soft delete error: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Soft delete failed".into())
        })
}
