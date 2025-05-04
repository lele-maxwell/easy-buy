
# 📄 Easy Buy Backend – Phase 1: Auth & User Management ✅

> A secure, extensible e-commerce backend written in Rust using Axum, PostgreSQL (SQLx), and JWT authentication.

---

## ✅ Technologies Used

| Tech               | Purpose                                      |
|--------------------|----------------------------------------------|
| **Rust (Axum)**    | Fast, safe web backend framework             |
| **PostgreSQL**     | Relational database for persistent storage   |
| **SQLx**           | Async database access                        |
| **Argon2**         | Password hashing algorithm                   |
| **JWT**            | Token-based stateless authentication         |
| **Serde**          | JSON (de)serialization                       |
| **dotenvy**        | Manage `.env` configuration                  |

---

## 📚 Accomplished Features

### 🔐 1. **User Registration**
- Route: `POST /api/auth/register`
- Accepts: `name`, `email`, `password`
- Hashes password using Argon2 and stores it securely.
- Returns success or error if email already exists.

### 🔑 2. **Login & JWT Token Generation**
- Route: `POST /api/auth/login`
- Verifies email & password.
- Issues a signed JWT with embedded user ID (`sub`) and expiration.

### 🧾 3. **Profile Management**
#### ✅ View Profile
- Route: `GET /api/user/profile`
- Protected by `AuthMiddleware`.
- Returns the authenticated user's data.

#### ✅ Update Profile
- Route: `PUT /api/user/profile`
- Accepts optional `name` and `email`.
- Updates the authenticated user's profile.
- Email uniqueness enforced.

### 🔐 4. **Password Change**
- Route: `PUT /api/auth/password`
- Requires current password and new password.
- Verifies current password.
- Hashes and updates new password securely.

### ❌ 5. **Account Deletion**
- Route: `DELETE /api/auth/delete`
- Authenticated route.
- Deletes user from the database.
- Returns success message.

---

## 🧱 Middleware & Structure

- **AuthMiddleware**: Decodes JWT token from the `Authorization` header and injects `Claims` into handlers.
- **Modular Design**:
  - `models/` for data structs
  - `services/` for business logic
  - `api/` for route handlers
  - `main.rs` wires up everything

---
  
## 🔐 Security Highlights

- Passwords are **never stored in plain text** — Argon2 + Salt used.
- JWTs include expiration (`exp`) for token timeout.
- Authentication is required for all protected routes.

---

## 📂 Routes Summary

| Endpoint                  | Method | Auth Required | Purpose                  |
|---------------------------|--------|----------------|---------------------------|
| `/api/auth/register`      | POST   | ❌              | Create a new account      |
| `/api/auth/login`         | POST   | ❌              | Login and receive token   |
| `/api/user/profile`       | GET    | ✅              | View current user         |
| `/api/user/profile`       | PUT    | ✅              | Update profile info       |
| `/api/auth/password`      | PUT    | ✅              | Change user password      |
| `/api/auth/delete`        | DELETE | ✅              | Delete own account        |

---

## 🧩 Next Steps

- 📦 **Product management APIs** (add, update, delete, view)
- 🛒 Order handling
- 💳 Payments (Stripe/PayPal)
- 👤 **Role-Based Access Control (RBAC)** – Admins, Vendors, Customers
- 📊 Admin dashboard analytics (users, sales, inventory)