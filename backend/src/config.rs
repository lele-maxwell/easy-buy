use dotenvy::dotenv;
use std::env;

pub fn load_env() {
    dotenv().ok();

    // Optional: Check a few important vars
    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let jwt_secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");

    println!("✅ Loaded environment variables");
    println!("📦 Using DB: {}", db_url);
    println!("🔐 JWT secret: {}...", &jwt_secret[..5]);
}
