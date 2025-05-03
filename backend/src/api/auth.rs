// src/api/auth.rs

use axum::{
    routing::post,
    Router,
};
use sqlx::PgPool;

use crate::services::auth::{register_user, login_user};

pub fn auth_routes() -> Router<PgPool> {
    Router::new()
        .route("/register", post(register_user))
        .route("/login", post(login_user))
}
