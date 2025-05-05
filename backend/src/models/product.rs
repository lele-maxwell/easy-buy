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


