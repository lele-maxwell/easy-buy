use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use sqlx::FromRow;
use uuid::Uuid;




#[derive(Deserialize)]
pub struct CreateProduct {
    pub name: String,
    pub description: Option<String>,
    pub price: f64,
    pub stock_quantity: i32,
}


#[derive(Serialize, Deserialize, FromRow)]
pub struct Product {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub price: f64,
    pub stock_quantity: i32,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
}



// dendpoint to udate product content 
#[derive(Deserialize)]
pub struct UpdateProduct {
    pub name: Option<String>,
    pub description: Option<String>,
    pub price: Option<f64>,
    pub stock_quantity: Option<i32>,
    pub deleted_at: Option<chrono::NaiveDateTime>,
}

// search product 
#[derive(Debug, Deserialize)]
pub struct ProductQueryParams {
    pub query: Option<String>,
    pub category_id: Option<Uuid>,
    pub min_price: Option<f64>,
    pub max_price: Option<f64>,
    pub in_stock: Option<bool>,
    pub page: Option<u32>,
    pub limit: Option<u32>,
}


