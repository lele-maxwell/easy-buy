use axum::{
    extract::State, http::StatusCode, routing::{get, post}, Json, Router
};
use sqlx::PgPool;
use crate::{
    models::category::CreateCategory, services::category::{create_category, list_categories}, 
};


//categoy api routes 

pub fn category_routes() -> Router<PgPool> {
    Router::new()
    .route("/create", post(create_category_handler))
    .route("/list", get(list_categories_handler))

    
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


    //Listing categories 

pub async fn list_categories_handler(
    State(pool): State<PgPool>,
) -> Result<Json<impl serde::Serialize>, (StatusCode, String)> {
    let categories = list_categories(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(Json(categories))
}