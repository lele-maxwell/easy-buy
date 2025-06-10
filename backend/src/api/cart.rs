use axum::{
    extract::{State, Path},
    Json, Router,
    http::StatusCode,
    routing::{get, post, delete},
};
use sqlx::PgPool;
use uuid::Uuid;
use serde_json::json;
use crate::models::cart::AddToCartRequest;
use crate::services::cart;

pub fn cart_routes() -> Router<PgPool> {
    Router::new()
        .route("/cart", post(add_to_cart).get(get_cart))
        .route("/cart/:product_id", delete(remove_from_cart))
}




async fn add_to_cart(
    State(pool): State<PgPool>,
    Json(payload): Json<AddToCartRequest>,
) -> Result<Json<impl serde::Serialize>, (StatusCode, String)> {
    let user_id = get_user_id(); // Replace with real JWT logic
    match cart::add_to_cart(&pool, user_id, payload).await {
        Ok(item) => Ok(Json(item)),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to add to cart: {}", e))),
    }
}

async fn get_cart(
    State(pool): State<PgPool>,
) -> Result<Json<impl serde::Serialize>, (StatusCode, String)> {
    let user_id = get_user_id();
    match cart::get_user_cart(&pool, user_id).await {
        Ok(items) => Ok(Json(items)),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to fetch cart: {}", e))),
    }
}

async fn remove_from_cart(
    State(pool): State<PgPool>,
    Path(product_id): Path<Uuid>,
) -> Result<Json<impl serde::Serialize>, (StatusCode, String)> {
    let user_id = get_user_id();
    match cart::remove_from_cart(&pool, user_id, product_id).await {
        Ok(count) => Ok(Json(json!({ "message": "Removed from cart", "deleted": count }))),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, format!("Failed to remove: {}", e))),
    }
}

fn get_user_id() -> Uuid {
    Uuid::parse_str("103b1059-1626-4b18-89c1-04d392335962").unwrap()
}
