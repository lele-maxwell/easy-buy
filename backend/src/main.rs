use api::{auth::auth_routes, category::category_routes, products::product_routes, user::user_routes};
use axum::{
    routing::{get, post},
    Router,
};
use tower_http::cors::CorsLayer;

mod api;
mod config;
mod db;
mod middleware;
mod models;
mod services;


//use services::auth::{login_user, register_user};
use sqlx::postgres::PgPoolOptions;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    // Setup DB pool
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL not set");
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to database");

    // Define app routes
    let app = Router::new() 
        .route("/", get(|| async { "Easy Buy API is running 🚀" }))
        // .route("/api/auth/register", post(register_user))
        //.route("/api/auth/login", post(login_user))
        .nest("/api/auth", auth_routes())
        .nest("/api/user", user_routes())
        .nest("/api/product", product_routes(pool.clone()))
        .nest("/api/category", category_routes())
        .layer(CorsLayer::permissive()) 
        .with_state(pool); // pass state

    // Start the server
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8000")
        .await
        .expect("Failed to bind to address");

    println!("🚀 Server listening on http://localhost:8000");

    axum::serve(listener, app)
        .await
        .expect("Server failed to start");
}
