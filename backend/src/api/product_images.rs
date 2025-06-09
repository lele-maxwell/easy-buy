use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::{delete, get, post, put},
    Json, Router,
};
use sqlx::PgPool;
use uuid::Uuid;
use std::path::PathBuf;
use tokio::fs;
use axum_extra::extract::Multipart;

use crate::{
    models::product_image::{CreateProductImage, ProductImage, UpdateProductImage},
    services::product_image::{create_product_image, delete_product_image, get_product_images, update_product_image},
};

pub fn product_image_routes(pool: PgPool) -> Router<PgPool> {
    Router::new()
        .route("/", post(upload_image))
        .route("/:product_id", get(list_images))
        .route("/:image_id", put(update_image))
        .route("/:image_id", delete(delete_image))
        .with_state(pool)
}

async fn upload_image(
    State(pool): State<PgPool>,
    mut multipart: Multipart,
) -> Result<Json<ProductImage>, StatusCode> {
    let mut product_id = None;
    let mut image_url = None;
    let mut is_primary = false;

    while let Some(field) = multipart.next_field().await.map_err(|_| StatusCode::BAD_REQUEST)? {
        let name = field.name().unwrap_or_default();
        match name {
            "product_id" => {
                let value = field.text().await.map_err(|_| StatusCode::BAD_REQUEST)?;
                product_id = Some(Uuid::parse_str(&value).map_err(|_| StatusCode::BAD_REQUEST)?);
            }
            "is_primary" => {
                let value = field.text().await.map_err(|_| StatusCode::BAD_REQUEST)?;
                is_primary = value == "true";
            }
            "image" => {
                let data = field.bytes().await.map_err(|_| StatusCode::BAD_REQUEST)?;
                let filename = format!("{}.jpg", Uuid::new_v4());
                let upload_dir = PathBuf::from("uploads/products");
                fs::create_dir_all(&upload_dir).await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
                let filepath = upload_dir.join(&filename);
                fs::write(&filepath, data).await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
                image_url = Some(format!("/uploads/products/{}", filename));
            }
            _ => {}
        }
    }

    let product_id = product_id.ok_or(StatusCode::BAD_REQUEST)?;
    let image_url = image_url.ok_or(StatusCode::BAD_REQUEST)?;

    let image = create_product_image(
        &pool,
        CreateProductImage {
            product_id,
            image_url,
            is_primary: Some(is_primary),
        },
    )
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(image))
}

async fn list_images(
    State(pool): State<PgPool>,
    Path(product_id): Path<Uuid>,
) -> Result<Json<Vec<ProductImage>>, StatusCode> {
    let images = get_product_images(&pool, product_id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(images))
}

async fn update_image(
    State(pool): State<PgPool>,
    Path(image_id): Path<Uuid>,
    Json(update): Json<UpdateProductImage>,
) -> Result<Json<ProductImage>, StatusCode> {
    let image = update_product_image(&pool, image_id, update)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(image))
}

async fn delete_image(
    State(pool): State<PgPool>,
    Path(image_id): Path<Uuid>,
) -> Result<StatusCode, StatusCode> {
    delete_product_image(&pool, image_id)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::NO_CONTENT)
} 