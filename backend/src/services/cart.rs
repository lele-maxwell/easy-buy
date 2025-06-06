use crate::models::cart::{CartItem, AddToCartRequest};
use sqlx::PgPool;
use uuid::Uuid;

pub async fn add_to_cart(
    pool: &PgPool,
    user_id: Uuid,
    req: AddToCartRequest,
) -> Result<CartItem, sqlx::Error> {
    let cart_item = sqlx::query_as!( 
        CartItem, 
        r#"
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, product_id)
        DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity, updated_at = now()
        RETURNING *
        "#,
        user_id, 
        req.product_id,
        req.quantity,
    )
    .fetch_one(pool)
    .await?;

    Ok(cart_item)
}

pub async fn get_user_cart(
    pool: &PgPool,
    user_id: Uuid,
) -> Result<Vec<CartItem>, sqlx::Error> {
    let items = sqlx::query_as!(
        CartItem,
        "SELECT * FROM cart_items WHERE user_id = $1",
        user_id
    )
    .fetch_all(pool)
    .await?;

    Ok(items)
}

pub async fn remove_from_cart(
    pool: &PgPool,
    user_id: Uuid,
    product_id: Uuid,
) -> Result<u64, sqlx::Error> {
    let result = sqlx::query!(
        "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
        user_id,
        product_id
    )
    .execute(pool)
    .await?;

    Ok(result.rows_affected())
}
