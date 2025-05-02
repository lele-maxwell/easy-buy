use serde::{Deserialize, Serialize};
use validator::validate_email;

#[derive(Serialize, Deserialize)]
pub struct User {
    pub id: uuid::Uuid,
    pub email: String,
    pub hashed_password: String,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

impl RegisterRequest {
    // Validation for registration
    pub fn validate(&self) -> Result<(), String> {
        if !validate_email(&self.email) {
            return Err("Invalid email format".into());
        }
        if self.password.len() < 8 {
            return Err("Password must be at least 8 characters".into());
        }
        Ok(())
    }
}
