use sqlx::{Pool, Postgres};
use std::sync::OnceLock;

use crate::config::get_database_url;

static DB_POOL: OnceLock<Pool<Postgres>> = OnceLock::new();

pub async fn get_db_pool() -> Result<Pool<Postgres>, sqlx::Error> {
    if let Some(pool) = DB_POOL.get() {
        return Ok(pool.clone());
    }

    let database_url = get_database_url();
    let pool = sqlx::postgres::PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    DB_POOL.set(pool.clone()).unwrap();
    Ok(pool)
}
