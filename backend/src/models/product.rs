use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};
use sqlx::FromRow;
use uuid::Uuid;




#[derive(Deserialize)]
pub struct CreateProduct {
    pub name: String,
    pub description: Option<String>,
    pub price: f64,
    pub stock_quantity: i32,
    pub category_id: Option<Uuid>,
}


#[derive(Serialize, Deserialize, FromRow)]
pub struct Product {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub price: f64,
    pub stock_quantity: i32,
    pub category_id: Option<Uuid>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
    pub images: Option<Vec<String>>,
}



// dendpoint to udate product content 
#[derive(Deserialize)]
pub struct UpdateProduct {
    pub name: Option<String>,
    pub description: Option<String>,
    pub price: Option<f64>,
    pub stock_quantity: Option<i32>,
    pub category_id: Option<Uuid>,
    pub deleted_at: Option<DateTime<Utc>>,
    pub images: Option<Vec<String>>,
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


