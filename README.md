# CRM Management System (Full Stack)
### Spring Boot • React • MySQL • Spring Security • JWT

A secure, full-stack Customer Relationship Management system built to the exact project brief: manage leads, customers, tasks, and sales pipelines with role-based access for Admins and Sales Reps.

## 🚀 Live Demo

### Frontend (Vercel)

https://crm-management-system-sepia.vercel.app

### Backend API (Render)

https://crm-management-system-t301.onrender.com

### Swagger Documentation

https://crm-management-system-t301.onrender.com/swagger-ui/index.html

## Tech Stack
### Backend
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication
- Maven
### Frontend
- React
- React Router
- Axios
- CSS
### Database
- MySQL
### Tools
- Swagger
- Postman
- Git
- GitHub

## What's Inside

```
crm-project/
├── crm-backend/     # Java 21 + Spring Boot 3 REST API (JWT auth, MySQL/H2)
└── crm-frontend/    # React 18 SPA (React Router, Axios, role-based UI)
```

Each folder has its own detailed `README.md` with setup steps.

## Quick Start

**1. Start the backend** (runs on :8080)
```bash
cd crm-backend
mvn spring-boot:run
```

**2. Start the frontend** (runs on :3000)
```bash
cd crm-frontend
npm install
npm start
```

**3. Log in**
```
email: admin@crm.com
password: admin123
```
(This admin account is seeded automatically the first time the backend starts.)

## Feature Checklist (vs. project brief)

- [x] User registration/login with JWT (`/api/register`, `/api/login`, `/api/users/me`)
- [x] Role-based access: Admin vs Sales
- [x] Customer Management — full CRUD
- [x] Lead Management — CRUD + status filter + assign to rep
- [x] Task Management — CRUD + "my tasks" + mark done
- [x] Sales Management — CRUD + pipeline tracking
- [x] MySQL schema with 5 tables and the specified relationships
- [x] Swagger/OpenAPI docs at `/swagger-ui.html`
- [x] React frontend: Login/Register, Dashboard, Customers, Leads, Tasks, Sales pages
- [x] Role-based rendering (delete actions admin-only)
- [x] Postman collection for API testing
- [x] Project structure matches the spec's folder layout exactly

## Deliverables

- Complete source code (frontend + backend) ✅
- Postman Collection (`crm-backend/CRM.postman_collection.json`) ✅
- Swagger API docs (auto-generated, live at runtime) ✅
- Fully running full-stack CRM system ✅
- GitHub repository — up to you to push this folder to your own repo

## Suggested Next Steps (from the brief's "Optional Enhancements")

- Add pagination to list endpoints
- File Upload
- Sales Analytics Dashboard
- Docker Support
- JUnit + Mockito backend tests
- Notification system for tasks
- Email sending for follow-ups
- Dashboard charts (e.g. Recharts for sales stats)
- Dark mode toggle
