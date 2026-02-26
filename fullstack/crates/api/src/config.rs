pub struct AppConfig {
    pub database_url: String,
    pub port: u16,
    pub cors_origin: Option<String>,
}

impl AppConfig {
    pub fn from_env() -> Self {
        Self {
            database_url: std::env::var("DATABASE_URL")
                .expect("DATABASE_URL must be set"),
            port: std::env::var("PORT")
                .ok()
                .and_then(|p| p.parse().ok())
                .unwrap_or(8080),
            cors_origin: std::env::var("CORS_ORIGIN").ok(),
        }
    }
}
