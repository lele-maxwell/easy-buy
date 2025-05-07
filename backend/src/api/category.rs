use axum::{
    extract::State, http::StatusCode, routing::post, Json, Router
};
use sqlx::PgPool;
use crate::{
    models::category::CreateCategory, services::category::create_category, 
};


//categoy api routes 

pub fn category_routes() -> Router<PgPool> {
    Router::new()
    .route("/create", post(create_category_handler))
}





// creating category handler
    pub async fn create_category_handler(
        State(pool): State<PgPool>,
        Json(payload): Json<CreateCategory>,
    ) -> Result<Json<impl serde::Serialize>, (StatusCode, String)> {
        let category = create_category(&pool, payload)
            .await
            .map_err(|err| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB error: {}", err)))?;
    
        Ok(Json(category))
    }