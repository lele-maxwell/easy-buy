use axum::{response::IntoResponse, routing::post, Json, Router};
use axum::extract::Json;
use crate::models::{RegisterRequest, User};
use crate::services::auth::{hash_password, generate_jwt};
use sqlx::PgPool;
use uuid::Uuid;

async fn register_user(Json(payload): Json<RegisterRequest>, pool: PgPool) -> impl IntoResponse {
    // Validate registration request
    if let Err(e) = payload.validate() {
        return (axum::http::StatusCode::BAD_REQUEST, e).into_response();
    }

    // Check if the email already exists in the database
    let email_exists = sqlx::query!("SELECT 1 FROM users WHERE email = $1", payload.email)
        .fetch_optional(&pool)
        .await
        .unwrap()
        .is_some();

    if email_exists {
        return (axum::http::StatusCode::BAD_REQUEST, "Email already exists").into_response();
    }

    // Hash the password and create the user
    let hashed_password = hash_password(&payload.password);
    let user_id = Uuid::new_v4();

    sqlx::query!(
        "INSERT INTO users (id, email, hashed_password) VALUES ($1, $2, $3)",
        user_id,
        payload.email,
        hashed_password
    )
    .execute(&pool)
    .await
    .unwrap();

    // Generate JWT for the new user
    let token = generate_jwt(&user_id.to_string());

    (axum::http::StatusCode::CREATED, Json(token)).into_response()
}

pub fn auth_routes() -> Router {
    Router::new().route("/register", post(register_user))
}
