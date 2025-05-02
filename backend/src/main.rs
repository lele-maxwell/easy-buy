pub mod db;
pub mod config;

use axum::{routing::get, Router};
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;
use dotenvy::dotenv;
use std::env;

#[tokio::main]
async fn main() {
    dotenv().ok();
     // Load .env
     config::load_env();
      // DB pool
    let pool = db::init_db_pool().await;

    let app = Router::new()
        .route("/", get(|| async { "Easy Buy API is running 🚀" }))
        .layer(CorsLayer::permissive());
        //.nest("/auth", api::auth::auth_routes());

    println!("🚀 Server listening on http://localhost:8000");
    // ✅ Run the Axum server
    let listener = TcpListener::bind("0.0.0.0:8000").await.unwrap();
    axum::serve(listener, app).await.unwrap();

}


