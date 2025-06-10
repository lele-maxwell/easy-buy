use std::env;

use argon2::password_hash::SaltString;
use axum::response::IntoResponse;
use axum::{http::StatusCode, Json};
use argon2::{self, Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use rand_core::OsRng;
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;
use jsonwebtoken::{encode, Header, EncodingKey, decode, DecodingKey, Validation, Algorithm};
use crate::db::get_db_pool;
use crate::middleware::auth::AuthMiddleware;
use crate::models::user::{ChangePasswordRequest, Claims, RegisterRequest, RegisterResponse, UpdateProfileRequest, User};
use axum::extract::State;

// Registration function
pub async fn register_user(
    State(pool): State<PgPool>,
    Json(payload): Json<RegisterRequest>,
) -> Result<Json<RegisterResponse>, (StatusCode, String)> {
    println!("Attempting to register user: {}", payload.email);
    
    // Check if user already exists
    let existing_user = sqlx::query_as::<_, User>(
        "SELECT * FROM users WHERE email = $1"
    )
    .bind(&payload.email)
    .fetch_optional(&pool)
    .await
    .map_err(|e| {
        println!("Database error checking existing user: {:?}", e);
        (StatusCode::INTERNAL_SERVER_ERROR, "Database error".to_string())
    })?;

    if existing_user.is_some() {
        return Err((StatusCode::CONFLICT, "Email already registered".to_string()));
    }
    
    // Hash the password
    let salt = argon2::password_hash::SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let password_hash = argon2
        .hash_password(payload.password.as_bytes(), &salt)
        .map_err(|e| {
            println!("Password hashing error: {}", e);
            (StatusCode::UNPROCESSABLE_ENTITY, e.to_string())
        })?
        .to_string();

    let user_id = Uuid::new_v4();
    println!("Generated user ID: {}", user_id);

    let query = r#"
        INSERT INTO users (id, name, email, password_hash, role)
        VALUES ($1, $2, $3, $4, 'user')
        RETURNING id, name, email, password_hash, role
    "#;

    println!("Executing database query...");
    let user: User = sqlx::query_as(query)
        .bind(user_id)
        .bind(&payload.name)
        .bind(&payload.email)
        .bind(&password_hash)
        .fetch_one(&pool)
        .await
        .map_err(|e| {
            println!("Database error: {:?}", e);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed to create user: {}", e),
            )
        })?;

    println!("User registered successfully: {}", user.email);
    Ok(Json(RegisterResponse {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
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
    pub user: RegisterResponse,
}

pub async fn login_user(
    State(pool): State<PgPool>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<LoginResponse>, (StatusCode, String)>  {
    println!("Login attempt for email: {}", payload.email);

    let user = sqlx::query_as::<_, User>(
        "SELECT * FROM users WHERE email = $1"
    )
    .bind(&payload.email)
    .fetch_optional(&pool)
    .await
    .map_err(|e| {
        println!("Database error during login: {:?}", e);
        (StatusCode::INTERNAL_SERVER_ERROR, "Database error".to_string())
    })?;

    if let Some(user) = user {
        println!("User found, verifying password");
        // Parse the stored hash from the database
        let parsed_hash = PasswordHash::new(&user.password_hash)
            .map_err(|e| {
                println!("Failed to parse password hash: {:?}", e);
                (StatusCode::INTERNAL_SERVER_ERROR, "Failed to parse password hash".to_string())
            })?;

        // Verify the password against the stored hash
        Argon2::default()
            .verify_password(payload.password.as_bytes(), &parsed_hash)
            .map_err(|e| {
                println!("Password verification failed: {:?}", e);
                (StatusCode::BAD_REQUEST, "Invalid password".to_string())
            })?;

        println!("Password verified, generating token");
        // Generate JWT token
        let claims = Claims {
            sub: user.id.to_string(),
            exp: 10000000000000, // Example expiration
            role: user.role.clone(),
        };
        let secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");

        let token = encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(secret.as_bytes()),
        )
        .map_err(|e| {
            println!("Token generation failed: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Error generating token".to_string())
        })?;

        println!("Login successful for user: {}", user.email);
        Ok(Json(LoginResponse { 
            token,
            user: RegisterResponse {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        }))
    } else {
        println!("User not found for email: {}", payload.email);
        Err((StatusCode::NOT_FOUND, "User not found".to_string()))
    }
}

// endpoint to update user profiles
pub async fn update_profile(
    State(pool): State<PgPool>,
    AuthMiddleware(claims): AuthMiddleware,
    Json(payload): Json<UpdateProfileRequest>,
) -> Result<Json<RegisterResponse>, (StatusCode, String)> {
    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| (StatusCode::BAD_REQUEST, "Invalid user ID".to_string()))?;

    // Update the user in the database
    let _ = sqlx::query(
        r#"
        UPDATE users
        SET name = COALESCE($1, name),
            email = COALESCE($2, email)
        WHERE id = $3
        "#,
    )
    .bind(&payload.name)
    .bind(&payload.email)
    .bind(user_id)
    .execute(&pool)
    .await
    .map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed to update user: {}", e),
        )
    })?;

    // Now fetch the updated user to return in response
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
        .bind(user_id)
        .fetch_one(&pool)
        .await
        .map_err(|_| (StatusCode::NOT_FOUND, "User not found".to_string()))?;

    Ok(Json(RegisterResponse {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }))
}

// lets update the password based on current pass
pub async fn change_password(
    AuthMiddleware(claims): AuthMiddleware,
    State(pool): State<PgPool>,
    Json(payload): Json<ChangePasswordRequest>,
) -> Result<(StatusCode, String), (StatusCode, String)> {
    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| (StatusCode::UNAUTHORIZED, "Invalid token subject".to_string()))?;

    // Fetch user by ID
    let user = sqlx::query_as::<_, User>(
        "SELECT * FROM users WHERE id = $1"
    )
    .bind(user_id)
    .fetch_optional(&pool)
    .await
    .map_err(|e| {
        eprintln!("❌ Database error: {:?}", e);
        (StatusCode::INTERNAL_SERVER_ERROR, "Database error".to_string())
    })?
    .ok_or((StatusCode::NOT_FOUND, "User not found".to_string()))?;

    // Verify current password
    let parsed_hash = PasswordHash::new(&user.password_hash)
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Failed to parse password hash".to_string()))?;

    Argon2::default()
        .verify_password(payload.current_password.as_bytes(), &parsed_hash)
        .map_err(|_| (StatusCode::BAD_REQUEST, "Current password is incorrect".to_string()))?;

    // Hash new password
    let salt = SaltString::generate(&mut OsRng);
    let new_password_hash = Argon2::default()
        .hash_password(payload.new_password.as_bytes(), &salt)
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Hashing failed".to_string()))?
        .to_string();

    // Update password in DB
    sqlx::query("UPDATE users SET password_hash = $1 WHERE id = $2")
        .bind(&new_password_hash)
        .bind(user_id)
        .execute(&pool)
        .await
        .map_err(|e| {
            eprintln!("❌ Failed to update password: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Failed to update password".to_string())
        })?;

    Ok((StatusCode::OK, "Password updated successfully".to_string()))
}

// delelete login user
pub async fn delete_account(
    AuthMiddleware(claims): AuthMiddleware,
    State(pool): State<PgPool>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| (StatusCode::BAD_REQUEST, "Invalid user ID".to_string()))?;

    let result = sqlx::query("DELETE FROM users WHERE id = $1")
        .bind(user_id)
        .execute(&pool)
        .await
        .map_err(|err| {
            eprintln!("❌ Error deleting user: {:?}", err);
            (StatusCode::INTERNAL_SERVER_ERROR, "Failed to delete account".to_string())
        })?;

    if result.rows_affected() == 0 {
        return Err((StatusCode::NOT_FOUND, "User not found".to_string()));
    }

    Ok((StatusCode::OK, "Account deleted successfully"))
}

pub fn verify_token(token: &str) -> Result<Claims, jsonwebtoken::errors::Error> {
    let secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");
    let key = DecodingKey::from_secret(secret.as_bytes());
    
    decode::<Claims>(
        token,
        &key,
        &Validation::new(Algorithm::HS256)
    ).map(|data| data.claims)
}

pub async fn verify_token_handler(
    AuthMiddleware(claims): AuthMiddleware,
    State(pool): State<PgPool>,
) -> Result<Json<RegisterResponse>, (StatusCode, String)> {
    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| (StatusCode::BAD_REQUEST, "Invalid user ID".to_string()))?;

    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
        .bind(user_id)
        .fetch_one(&pool)
        .await
        .map_err(|_| (StatusCode::NOT_FOUND, "User not found".to_string()))?;

    Ok(Json(RegisterResponse {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }))
}
