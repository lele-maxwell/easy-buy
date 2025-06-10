use sqlx::{Pool, Postgres};
use std::sync::OnceLock;
use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;

use crate::config::get_database_url;

static DB_POOL: OnceLock<Pool<Postgres>> = OnceLock::new();

pub async fn get_db_pool() -> Result<PgPool, sqlx::Error> {
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    
    // Create the database pool
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;

    // Run migrations
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await?;

    Ok(pool)
}

// Create a new migration file for adding user roles
pub async fn create_user_role_type(pool: &PgPool) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        DO $$ BEGIN
            CREATE TYPE user_role AS ENUM ('admin', 'user');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;
        "#
    )
    .execute(pool)
    .await?;

    Ok(())
}

pub async fn add_role_to_users(pool: &PgPool) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'user';
        "#
    )
    .execute(pool)
    .await?;

    Ok(())
}
