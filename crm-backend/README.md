# CRM Software — Backend (Spring Boot)

Month 4 placement project. A secure, full-stack-ready **CRM REST API** built with Java 17 + Spring Boot 3, matching the project brief exactly: user auth, customers, leads, tasks, and sales — all with JWT authentication and role-based access (Admin / Sales).

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.3.4 |
| Security | Spring Security 6 + JWT (jjwt 0.12.5) |
| Persistence | Spring Data JPA / Hibernate |
| Database | MySQL (spec) — H2 in-memory enabled by default for instant local runs |
| Build Tool | Maven |
| Docs | springdoc-openapi (Swagger UI) |

## Project Structure (matches spec exactly)

```
crm-backend/
├── controller/      # REST endpoints
├── service/         # Business logic
├── repository/      # Spring Data JPA repositories
├── model/           # JPA entities (User, Customer, Lead, Task, Sale)
├── security/        # JWT filter/service, Spring Security config, user details
├── dto/             # Request/response DTOs
├── exception/        # Custom exceptions + global handler
└── application.properties
```

## Getting Started

```bash
cd crm-backend
mvn spring-boot:run
```

Runs on **http://localhost:8080**. A default admin is seeded automatically:
```
email: admin@crm.com
password: admin123
```

### Swagger UI
```
http://localhost:8080/swagger-ui.html
```

### Switch to MySQL (per spec)
Edit `src/main/resources/application.properties`: comment the H2 block, uncomment the MySQL block, set your credentials. Database `crm_db` will be auto-created.

## API Endpoints (exactly as specified)

### 1. User Management & Authentication
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/register` | Public — register Admin or Sales |
| POST | `/api/login` | Public — returns JWT |
| GET | `/api/users/me` | Authenticated — current user profile |

### 2. Customer Management
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/customers` | Admin, Sales |
| GET | `/api/customers/{id}` | Admin, Sales |
| POST | `/api/customers` | Admin, Sales |
| PUT | `/api/customers/{id}` | Admin, Sales |
| DELETE | `/api/customers/{id}` | Admin only |

### 3. Lead Management
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/leads` | Admin, Sales |
| POST | `/api/leads` | Admin, Sales |
| PUT | `/api/leads/{id}` | Admin, Sales |
| DELETE | `/api/leads/{id}` | Admin only |

### 4. Task Management
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/tasks` | Admin, Sales |
| POST | `/api/tasks` | Admin, Sales |
| PUT | `/api/tasks/{id}` | Admin, Sales |
| DELETE | `/api/tasks/{id}` | Admin only |

### 5. Sales Management
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/sales` | Admin, Sales |
| GET | `/api/sales/{id}` | Admin, Sales |
| POST | `/api/sales` | Admin, Sales |
| PUT | `/api/sales/{id}` | Admin, Sales |

## Database Schema

**Tables:** `users`, `customers`, `leads`, `tasks`, `sales`

**Relationships:**
- A user (sales rep) can be assigned to leads, customers, tasks, and sales (`@ManyToOne` from each entity to `User`)
- Sales are linked to customers (`@ManyToOne` from `Sale` to `Customer`)

## Data Models

**User:** fullName, email, password (BCrypt encrypted), role (ADMIN/SALES), createdAt

**Customer:** name, email, phone, company, address, assignedSalesRep, notes

**Lead:** name, contactInfo, source (REFERRAL/ADS/WEB), status (NEW/CONTACTED/CONVERTED/LOST), assignedSalesRep

**Task:** title, description, dueDate, priority (LOW/MEDIUM/HIGH), assignedTo, status (OPEN/IN_PROGRESS/COMPLETED)

**Sale:** customer, amount, status (PROPOSAL/NEGOTIATION/CLOSED_WON/CLOSED_LOST), date, assignedSalesRep

## Testing

1. Import `CRM.postman_collection.json` into Postman
2. Login first (`/api/login`) to get a token, then paste it into the `token` collection variable
3. All other requests are pre-wired with `Authorization: Bearer {{token}}`

Or test directly via Swagger UI at `/swagger-ui.html`.

## What This Demonstrates (for interviews)

- Layered architecture (Controller → Service → Repository → DTO)
- Spring Security + stateless JWT auth, BCrypt password hashing
- Role-based authorization at the URL/method level
- JPA relationships (`@ManyToOne`) across 5 linked tables
- Bean validation with clean, consistent error responses
- CORS configuration for a separate React frontend
- REST API design matching a real client specification exactly
