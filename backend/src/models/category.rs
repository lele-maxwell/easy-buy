use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Serialize, FromRow)]
pub struct Category {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>, 
    pub created_at: Option<chrono::NaiveDateTime>,
    pub updated_at: Option<chrono::NaiveDateTime>,
    
    

}

#[derive(Debug, Deserialize)]
pub struct CreateCategory {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdateCategoryRequest {
    pub name: Option<String>,
    pub description: Option<String>,
}

// Define the CategoryFilter struct to handle filtering
#[derive(Deserialize)]
pub struct CategoryFilter {
    pub name: Option<String>,  // The name to filter categories by (optional)
}
