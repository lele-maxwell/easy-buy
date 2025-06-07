use argon2::{self, Argon2, PasswordHasher};
use argon2::password_hash::SaltString;
use rand_core::OsRng;

fn main() {
    let password = "admin123";
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    
    let password_hash = argon2
        .hash_password(password.as_bytes(), &salt)
        .expect("Failed to hash password")
        .to_string();
    
    println!("Generated hash for 'admin123': {}", password_hash);
} 