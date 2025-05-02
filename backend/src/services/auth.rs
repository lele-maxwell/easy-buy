use argon2::{self, Config};
use jsonwebtoken::{encode, EncodingKey, Header};
use serde::{Deserialize, Serialize};
use std::env;
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
}

pub fn hash_password(password: &str) -> String {
    let config = Config::default();
    argon2::hash_encoded(password.as_bytes(), b"some_salt", &config).unwrap()
}

pub fn verify_password(hashed_password: &str, password: &str) -> bool {
    argon2::verify_encoded(hashed_password, password.as_bytes()).unwrap_or(false)
}

pub fn generate_jwt(user_id: &str) -> String {
    let expiration = 3600; // 1 hour in seconds
    let claims = Claims {
        sub: user_id.to_owned(),
        exp: expiration,
    };

    let secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");
    let encoding_key = EncodingKey::from_secret(secret.as_bytes());

    encode(&Header::default(), &claims, &encoding_key).unwrap()
}
