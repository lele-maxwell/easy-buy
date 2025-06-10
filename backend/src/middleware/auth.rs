use axum::{
    async_trait,
    extract::{FromRequestParts, State},
    http::{request::Parts, StatusCode, Request},
    response::IntoResponse,
    middleware::Next,
    response::Response,
};
use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};
use crate::models::user::Claims;
use std::env;
use sqlx::PgPool;
use crate::models::user::UserRole;

pub struct AuthMiddleware(pub Claims);

#[async_trait]
impl<S> FromRequestParts<S> for AuthMiddleware
where
    S: Send + Sync,
{
    type Rejection = (StatusCode, String);

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let auth_header = parts
            .headers
            .get("Authorization")
            .and_then(|value| value.to_str().ok())
            .ok_or((StatusCode::UNAUTHORIZED, "Missing authorization header".to_string()))?;

        let token = auth_header
            .strip_prefix("Bearer ")
            .ok_or((StatusCode::UNAUTHORIZED, "Invalid token format".to_string()))?;

        let claims = crate::services::auth::verify_token(token)
            .map_err(|_| (StatusCode::UNAUTHORIZED, "Invalid token".to_string()))?;

        Ok(AuthMiddleware(claims))
    }
}

pub async fn require_admin(
    State(_pool): State<PgPool>,
    req: Request<axum::body::Body>,
    next: Next,
) -> Result<Response, StatusCode> {
    let auth_header = req
        .headers()
        .get("Authorization")
        .and_then(|value| value.to_str().ok())
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or(StatusCode::UNAUTHORIZED)?;

    // Verify token and get user role
    let claims = crate::services::auth::verify_token(token)
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    if claims.role != UserRole::Admin {
        return Err(StatusCode::FORBIDDEN);
    }

    Ok(next.run(req).await)
}

pub async fn require_auth(
    State(_pool): State<PgPool>,
    req: Request<axum::body::Body>,
    next: Next,
) -> Result<Response, StatusCode> {
    let auth_header = req
        .headers()
        .get("Authorization")
        .and_then(|value| value.to_str().ok())
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or(StatusCode::UNAUTHORIZED)?;

    // Verify token
    let _claims = crate::services::auth::verify_token(token)
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    Ok(next.run(req).await)
}
