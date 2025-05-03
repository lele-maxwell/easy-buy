// src/api/user.rs
use axum::{routing::get, Router};
use crate::middleware::auth::AuthMiddleware;
use crate::models::user::Claims;
use axum::extract::State;
use sqlx::PgPool;

pub fn user_routes() -> Router<PgPool> {
    Router::new()
        .route("/profile", get(protected_profile))
}

async fn protected_profile(
    AuthMiddleware(claims): AuthMiddleware,
    State(pool): State<PgPool>,
) -> String {
    format!("Hello, {}!", claims.sub)
}

