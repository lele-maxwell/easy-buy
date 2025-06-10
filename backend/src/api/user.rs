// src/api/user.rs
use crate::middleware::auth::AuthMiddleware;
use crate::models::user::Claims;
use axum::extract::State;
use axum::routing::put;
use axum::{routing::get, Router};
use sqlx::PgPool;

pub fn user_routes() -> Router<PgPool> {
    Router::new()
        .route("/profile", get(protected_profile))
        //.route("/profile", get(get_profile))
        .route("/profile", put(update_profile)) // <-- add this
}

async fn protected_profile(
    AuthMiddleware(claims): AuthMiddleware,
    State(pool): State<PgPool>,
) -> String {
    format!("Hello, {}!", claims.sub)
}

use crate::services::auth::update_profile;
