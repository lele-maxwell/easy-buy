use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    routing::{delete, get, post, put},
    Json, Router,
    response::IntoResponse,
};
use sqlx::{FromRow, PgPool, QueryBuilder};
use uuid::Uuid;
use std::path::PathBuf;
use tokio::fs;
use axum_extra::extract::Multipart;
use serde::{Deserialize, Serialize};
use std::io::Write;
use std::path::Path as StdPath;

use crate::{models::product::{Product, ProductQueryParams, UpdateProduct}, services::product::{create_product, delete_product, soft_delete_product, update_product, add_product_image}};
use crate::models::product::CreateProduct;

pub fn product_routes(pool: PgPool) -> Router<PgPool> {
    Router::new()
        .route("/", post(create_product_handler))       // POST /api/product
        .route("/", get(list_products))                // GET /api/product
        .route("/search", get(search_products_handler)) // GET /api/product/search
        .route("/get/:id", get(get_product))               // GET /api/product/:id
        .route("/update/:id", put(update_product_handler))    // PUT /api/product/:id
        .route("/delete/:id", delete(delete_product_handler)) // DELETE /api/product/:id
        .route("/soft-delete/:id", delete(soft_delete_product_handler)) // DELETE /api/product/soft/:id
        .route("/upload-image", post(upload_product_image))
        .route("/delete-image/:product_id/:image_url", delete(delete_product_image))
        .with_state(pool)
}

// creating new products 
pub async fn create_product_handler(
    State(pool): State<PgPool>,
    Json(payload): Json<CreateProduct>,
) -> Result<Json<Product>, (StatusCode, String)> {
    let product = create_product(&pool, payload)
        .await
        .map_err(|e| {
            eprintln!("❌ Failed to create product: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Failed to create product".to_string())
        })?;
    Ok(Json(product))
}

// to get product from data base
pub async fn get_product(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<Json<Product>, (StatusCode, String)> {
    let product = sqlx::query_as::<_, Product>("SELECT * FROM products WHERE id = $1")
        .bind(id)
        .fetch_optional(&pool)
        .await
        .map_err(|e| {
            eprintln!("❌ Database error: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Database error".to_string())
        })?
        .ok_or((StatusCode::NOT_FOUND, "Product not found".to_string()))?;

    Ok(Json(product))
}

// list all products available 
pub async fn list_products(
    State(pool): State<PgPool>,
) -> Result<Json<Vec<Product>>, (StatusCode, String)> {
    let products = sqlx::query_as::<_, Product>("SELECT * FROM products")
        .fetch_all(&pool)
        .await
        .map_err(|e| {
            eprintln!("❌ Failed to fetch products: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Database error".to_string())
        })?;

    Ok(Json(products))
}

// update product 
pub async fn update_product_handler(
    Path(id): Path<Uuid>,
    State(pool): State<PgPool>,
    Json(update): Json<UpdateProduct>,
) -> Result<Json<crate::models::product::Product>, (StatusCode, String)> {
    update_product(&pool, id, update)
        .await
        .map(Json)
        .map_err(|e| {
            eprintln!("❌ Failed to update product: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Failed to update product".to_string())
        })
}

// delete product 
pub async fn delete_product_handler(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, (StatusCode, String)> {
    delete_product(&pool, id)
        .await
        .map_err(|e| {
            eprintln!("❌ Failed to delete product: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Failed to delete product".to_string())
        })?;

    Ok(StatusCode::NO_CONTENT) // 204
}

//soft delete
pub async fn soft_delete_product_handler(
    State(pool): State<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, (StatusCode, String)> {
    soft_delete_product(&pool, id).await
        .map(|_| StatusCode::NO_CONTENT)
        .map_err(|e| {
            eprintln!("❌ Soft delete error: {:?}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, "Soft delete failed".into())
        })
}

// product search 
pub async fn search_products_handler(
    State(pool): State<PgPool>,
    Query(params): Query<ProductQueryParams>,
) -> Result<Json<Vec<Product>>, (StatusCode, String)> {
    let mut builder = QueryBuilder::new("SELECT * FROM products WHERE deleted_at IS NULL");

    if let Some(query) = &params.query {
        builder.push(" AND name ILIKE ").push_bind(format!("%{}%", query));
    }

    if let Some(category_id) = params.category_id {
        builder.push(" AND category_id = ").push_bind(category_id);
    }

    if let Some(min_price) = params.min_price {
        builder.push(" AND price >= ").push_bind(min_price);
    }

    if let Some(max_price) = params.max_price {
        builder.push(" AND price <= ").push_bind(max_price);
    }

    if let Some(true) = params.in_stock {
        builder.push(" AND stock_quantity > 0");
    }

// pagination 
    let page = params.page.unwrap_or(1);
    let limit = params.limit.unwrap_or(10);
    let limit_i32 = limit as i32;
    let offset_i32 = ((page - 1) * limit) as i32;
    
    builder.push(" LIMIT ").push_bind(limit_i32);
    builder.push(" OFFSET ").push_bind(offset_i32);  
    let query = builder.build_query_as::<Product>();

    let products = query
        .fetch_all(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("DB error: {}", e)))?;

    Ok(Json(products))
}

pub async fn upload_product_image(
    State(pool): State<PgPool>,
    mut multipart: Multipart,
) -> impl IntoResponse {
    let mut image_url = None;
    let mut product_id = None;

    while let Some(field) = multipart.next_field().await.unwrap() {
        let name = field.name().unwrap().to_string();
        
        if name == "image" {
            let data = field.bytes().await.unwrap();
            let file_name = format!("{}.jpg", Uuid::new_v4());
            let upload_dir = StdPath::new("uploads");
            
            // Create uploads directory if it doesn't exist
            if !upload_dir.exists() {
                if let Err(e) = fs::create_dir_all(upload_dir).await {
                    eprintln!("Failed to create uploads directory: {}", e);
                    return (StatusCode::INTERNAL_SERVER_ERROR, "Failed to create uploads directory").into_response();
                }
            }
            
            let file_path = upload_dir.join(&file_name);
            match std::fs::File::create(&file_path) {
                Ok(mut file) => {
                    if let Err(e) = file.write_all(&data) {
                        eprintln!("Failed to write image file: {}", e);
                        return (StatusCode::INTERNAL_SERVER_ERROR, "Failed to save image").into_response();
                    }
                    image_url = Some(format!("/uploads/{}", file_name));
                }
                Err(e) => {
                    eprintln!("Failed to create image file: {}", e);
                    return (StatusCode::INTERNAL_SERVER_ERROR, "Failed to create image file").into_response();
                }
            }
        } else if name == "product_id" {
            match field.text().await {
                Ok(data) => {
                    match Uuid::parse_str(&data) {
                        Ok(id) => product_id = Some(id),
                        Err(e) => {
                            eprintln!("Invalid product ID: {}", e);
                            return (StatusCode::BAD_REQUEST, "Invalid product ID").into_response();
                        }
                    }
                }
                Err(e) => {
                    eprintln!("Failed to read product ID: {}", e);
                    return (StatusCode::BAD_REQUEST, "Failed to read product ID").into_response();
                }
            }
        }
    }

    match (image_url, product_id) {
        (Some(url), Some(id)) => {
            let url_clone = url.clone();
            match add_product_image(&pool, id, url).await {
                Ok(_) => (StatusCode::OK, Json(serde_json::json!({ "image_url": url_clone }))).into_response(),
                Err(e) => {
                    eprintln!("Failed to save image URL to database: {}", e);
                    (StatusCode::INTERNAL_SERVER_ERROR, "Failed to save image URL").into_response()
                }
            }
        }
        _ => (StatusCode::BAD_REQUEST, "Missing image or product_id").into_response(),
    }
}

// Add a new endpoint to delete an image from a product
pub async fn delete_product_image(
    Path((product_id, image_url)): Path<(Uuid, String)>,
    State(pool): State<PgPool>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    // First, try to delete the file from the filesystem
    let file_path = format!("uploads/{}", image_url);
    if let Err(e) = tokio::fs::remove_file(&file_path).await {
        eprintln!("Failed to delete image file: {}", e);
        // Continue with database update even if file deletion fails
    }

    // Update the database to remove the image URL
    let result = sqlx::query!(
        "UPDATE products SET images = array_remove(images, $1) WHERE id = $2 RETURNING images",
        format!("/uploads/{}", image_url),
        product_id
    )
    .fetch_one(&pool)
    .await
    .map_err(|e| {
        eprintln!("Failed to update database: {}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    Ok(Json(serde_json::json!({ "images": result.images })))
}


