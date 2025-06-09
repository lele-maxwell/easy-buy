use axum::{
    routing::{get, post},
    Router,
};
use tower_http::cors::{CorsLayer, Any};
use axum::http::{header, Method};
use std::net::SocketAddr;
use axum::serve;

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
    dotenv::dotenv().ok();

    // Setup DB pool
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL not set");
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to database");

    // Define app routes
    let cors = CorsLayer::new()
        .allow_origin("http://localhost:3000".parse::<axum::http::HeaderValue>().unwrap())
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE, Method::OPTIONS])
        .allow_headers([header::CONTENT_TYPE, header::AUTHORIZATION])
        .allow_credentials(true)
        .expose_headers([header::AUTHORIZATION]);

    let app = Router::new()
        .route("/", get(|| async { "Easy Buy API is running 🚀" }))
        .nest("/api", Router::new()
            .nest("/auth", api::auth::auth_routes())
            .merge(api::user::user_routes())
            .nest("/products", api::products::product_routes(pool.clone()))
            .merge(api::category::category_routes())
            .merge(api::cart::cart_routes())
        )
        .layer(cors)
        .with_state(pool);

    let addr = SocketAddr::from(([127, 0, 0, 1], 8000));
    println!("🚀 Server listening on http://{}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    serve(listener, app).await.unwrap();
}
