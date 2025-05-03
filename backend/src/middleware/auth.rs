use axum::{
    async_trait,
    extract::{FromRequestParts},
    http::{request::Parts, StatusCode},
    response::IntoResponse,
};
use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};
use crate::models::user::Claims;
use std::env;

pub struct AuthMiddleware(pub Claims);

#[async_trait]
impl<S> FromRequestParts<S> for AuthMiddleware
where
    S: Send + Sync,
{
    type Rejection = (StatusCode, String); // Add this line to define the Rejection type

    async fn from_request_parts(
        parts: &mut Parts,
        _state: &S,
    ) -> Result<Self, Self::Rejection> {
        let auth_header = parts
            .headers
            .get("Authorization")
            .ok_or((StatusCode::UNAUTHORIZED, "Missing Authorization header".to_string()))?
            .to_str()
            .map_err(|_| (StatusCode::BAD_REQUEST, "Invalid header format".to_string()))?;

        let token = auth_header
            .strip_prefix("Bearer ")
            .ok_or((StatusCode::UNAUTHORIZED, "Missing Bearer prefix".to_string()))?;

            let secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");
            let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(secret.as_bytes()),
            &Validation::new(Algorithm::HS256),
        )
        .map_err(|e| (StatusCode::UNAUTHORIZED, format!("Invalid token: {}", e)))?;

        Ok(AuthMiddleware(token_data.claims))
    }
}
