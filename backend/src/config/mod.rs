pub fn get_database_url() -> String {
    std::env::var("DATABASE_URL").expect("DATABASE_URL not set")
} 