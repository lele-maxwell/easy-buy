# Easy Buy Backend

## Setup Instructions

1. Install dependencies:
```bash
cargo build
```

2. Set up the database:
```bash
# Create a .env file with your database configuration
cp .env.example .env

# Run migrations
cargo run --bin migrate
```

3. Create an admin user:
```bash
# The default admin credentials are:
# Email: admin@example.com
# Password: admin123

# IMPORTANT: Change these credentials in production!
```

## Security Notes

- Never commit sensitive data or credentials to the repository
- Always use environment variables for sensitive configuration
- Change default passwords in production
- Use proper password hashing in production
- Keep your dependencies updated

## Development

- Run the server: `cargo run`
- Run tests: `cargo test`
- Run migrations: `cargo run --bin migrate` 