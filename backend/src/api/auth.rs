// src/api/auth.rs

use axum::{
    routing::{delete, post, put, get},
    Router,
};
use sqlx::PgPool;

use crate::services::auth::{change_password, delete_account, login_user, register_user, verify_token_handler};

pub fn auth_routes() -> Router<PgPool> { 
    Router::new()
        .route("/register", post(register_user))
        .route("/login", post(login_user))
        .route("/password", put(change_password))
        .route("/delete", delete(delete_account))
        .route("/verify", get(verify_token_handler))
}
