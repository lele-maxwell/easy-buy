// src/api/user.rs
use crate::middleware::auth::AuthMiddleware;
use crate::models::user::Claims;
use axum::extract::State;
use axum::routing::put;
use axum::{routing::get, Router, middleware};
use sqlx::PgPool;
use axum::Json;
use crate::models::user::{User, UserRole};
use uuid::Uuid;
use serde::Serialize;

pub fn user_routes(pool: PgPool) -> Router<PgPool> {
    Router::new()
        .route("/profile", get(protected_profile))
        //.route("/profile", get(get_profile))
        .route("/profile", put(update_profile)) // <-- add this
        .nest("/admin", Router::new()
            .route("/users", get(list_users))
            .layer(middleware::from_fn_with_state(pool.clone(), require_admin))
        )
}

async fn protected_profile(
    AuthMiddleware(claims): AuthMiddleware,
    State(pool): State<PgPool>,
) -> String {
    format!("Hello, {}!", claims.sub)
}

use crate::services::auth::update_profile;
use crate::middleware::auth::require_admin;

/// Handler to list all users (admin only)
async fn list_users(State(pool): State<PgPool>) -> Result<Json<Vec<UserListResponse>>, (axum::http::StatusCode, String)> {
    let users = sqlx::query_as!(UserListResponse,
        r#"SELECT id, name, email, role as "role: _" FROM users"#
    )
    .fetch_all(&pool)
    .await
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, format!("DB error: {}", e)))?;
    Ok(Json(users))
}

#[derive(Debug, Serialize)]
pub struct UserListResponse {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub role: UserRole,
}
