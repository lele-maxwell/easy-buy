// src/api/auth.rs

use axum::{
    routing::{post, put},
    Router,
};
use sqlx::PgPool;

use crate::services::auth::{change_password, login_user, register_user};

pub fn auth_routes() -> Router<PgPool> {
    Router::new()
        .route("/register", post(register_user))
        .route("/login", post(login_user))
        .route("/password", put(change_password))
}
