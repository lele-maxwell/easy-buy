# Easy Buy System Architecture

## Overview
The architecture of the Easy Buy platform is divided into several components that work together to deliver an e-commerce experience. Below is a high-level breakdown of the system and its key components.

## Architecture Diagram

![Easy Buy System Architecture](docs/images/diag.png)

## Key Components

### Frontend
- **Technology:** React.js, Tailwind CSS
- **Responsibilities:** User Interface (UI), Customer Interaction, React Router for navigation.

### Backend
- **Technology:** Rust, Axum
- **Responsibilities:** API routing, Business logic, Request handling, Database integration.

### Database
- **Technology:** PostgreSQL
- **Responsibilities:** User Data, Transactions, Inventory Management, PDF metadata storage.

### Storage
- **Technology:** MinIO (S3-Compatible Storage)
- **Responsibilities:** File storage for PDFs, backups, and other documents.

### Infrastructure
- **Platform:** DigitalOcean
- **Responsibilities:** Hosting, Virtual Machines, Load Balancing.

### CI/CD
- **Technology:** GitHub Actions
- **Responsibilities:** Build Automation, Deployment Pipelines, Continuous Integration.

### Docker
- **Responsibilities:** Containerization, Development Environment, Production Environment.

---

## Technology Stack

1. **Frontend:**
    - React.js
    - Tailwind CSS

2. **Backend:**
    - Rust
    - Axum
    - SQLx (PostgreSQL integration)
    - tokio (Async runtime)
    - dotenvy (Environment management)

3. **Database:**
    - PostgreSQL

4. **Storage:**
    - MinIO (for S3 compatible object storage)

5. **Infrastructure:**
    - DigitalOcean
    - Nginx for reverse proxy

6. **CI/CD:**
    - GitHub Actions

7. **Containerization:**
    - Docker

---

This markdown includes the project system architecture, technology stack, and its components. You can copy and paste this into your project documentation.
