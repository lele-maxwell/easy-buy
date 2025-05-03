use std::env;

use axum::{http::StatusCode, Json};
use argon2::{self, Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use rand_core::OsRng;
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;
use jsonwebtoken::{encode, Header, EncodingKey};  // Added JWT imports
use crate::db::get_db_pool;
use crate::models::user::{Claims, RegisterRequest, RegisterResponse, User};
use axum::extract::State;

// Registration function
pub async fn register_user(
    Json(payload): Json<RegisterRequest>,
) -> Result<Json<RegisterResponse>, (StatusCode, String)> {
    let pool = get_db_pool().await.map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("DB connection error: {}", e),
        )
    })?;

    // Hash the password
    let salt = argon2::password_hash::SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let password_hash = argon2
        .hash_password(payload.password.as_bytes(), &salt)
        .map_err(|e| (StatusCode::UNPROCESSABLE_ENTITY, e.to_string()))?
        .to_string();

    let user_id = Uuid::new_v4();

    let query = r#"
        INSERT INTO users (id, name, email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, password_hash
    "#;

    let user: User = sqlx::query_as(query)
        .bind(user_id)
        .bind(&payload.name)
        .bind(&payload.email)
        .bind(&password_hash)
        .fetch_one(&pool)
        .await
        .map_err(|e| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to create user: {}", e),
            )
        })?;

    Ok(Json(RegisterResponse {
        id: user.id,
        name: user.name,
        email: user.email,
    }))
}

// Login function
#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub token: String,
}



pub async fn login_user(
    State(pool): State<PgPool>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<LoginResponse>, (StatusCode, String)>  {

    let user = sqlx::query_as::<_, User>(
        "SELECT * FROM users WHERE email = $1"
    )
    .bind(&payload.email)
    .fetch_optional(&pool)
    .await
    .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Database error".to_string()))?;

    if let Some(user) = user {
        // Parse the stored hash from the database
        let parsed_hash = PasswordHash::new(&user.password_hash)
            .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Failed to parse password hash".to_string()))?;

        // Verify the password against the stored hash
        Argon2::default()
            .verify_password(payload.password.as_bytes(), &parsed_hash)
            .map_err(|_| (StatusCode::BAD_REQUEST, "Invalid password".to_string()))?;

        // Generate JWT token
        let claims = Claims {
            sub: user.id.to_string(),
            exp: 10000000000, // Example expiration
        };
        let secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");

        let token = encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(secret.as_bytes()),
        )
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Error generating token".to_string()))?;

        Ok(Json(LoginResponse { token }))
    } else {
        Err((StatusCode::NOT_FOUND, "User not found".to_string()))
    }
}


