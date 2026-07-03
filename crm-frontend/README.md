# CRM Software — Frontend (React.js)

Month 4 placement project. React frontend for the CRM Software system, matching the project brief: login/registration, dashboard, customer/lead/task/sales management, and role-based rendering (Admin vs Sales Rep).

## Tech Stack

- React 18 (functional components + hooks)
- React Router v6 (routing + protected routes)
- Axios (API calls, with JWT auto-attached via interceptor)
- Plain CSS with a design-token system (no UI framework dependency)

## Project Structure (matches spec exactly)

```
crm-frontend/
├── src/
│   ├── components/     # Layout (sidebar), Modal, StatusPill
│   ├── pages/           # Login, Register, Dashboard, Customers, Leads, Tasks, Sales
│   ├── services/        # Axios API calls (one file per resource)
│   ├── utils/            # AuthContext, ProtectedRoute
│   └── App.js
├── public/
│   └── index.html
└── package.json
```

## Getting Started

```bash
cd crm-frontend
npm install
npm start
```

Runs on **http://localhost:3000**. Make sure the backend is running on `http://localhost:8080` first (see `crm-backend/README.md`).

Default login (seeded automatically by the backend):
```
email: admin@crm.com
password: admin123
```

### Environment Variables
`.env` already points to the backend:
```
REACT_APP_API_URL=http://localhost:8080
```
Change this if your backend runs elsewhere.

## Pages

| Page | Route | Description |
|---|---|---|
| Login | `/login` | Email/password sign in, returns JWT |
| Register | `/register` | Create Admin or Sales Rep account |
| Dashboard | `/dashboard` | Overview stats (customers, leads, tasks, revenue) + recent activity |
| Customers | `/customers` | List, add, edit, delete customers |
| Leads | `/leads` | List, filter by status, add/edit/delete, assign to sales rep |
| Tasks | `/tasks` | List, "my tasks" filter, add/edit/delete, mark done |
| Sales | `/sales` | Track deals, update status, linked to customers |

## Auth & Route Protection

- JWT token stored in `localStorage` (`crm_token`) as specified
- `AuthContext` (`utils/AuthContext.js`) exposes `user`, `login()`, `register()`, `logout()`
- `ProtectedRoute` (`utils/ProtectedRoute.js`) redirects to `/login` if not authenticated, and supports an `adminOnly` flag for admin-restricted pages
- Axios interceptor in `services/api.js` attaches the token to every request and force-logs-out on a 401 response

## Role-Based Rendering

- **Delete** buttons on Customers/Leads/Tasks only appear for `ADMIN` users (matches backend's admin-only delete restriction)
- Sidebar shows the logged-in user's name, email, and role badge
- Same pages render for both roles, but destructive actions are gated by role

## Design System

A small CSS variable system in `src/index.css` drives a consistent look:
- **Primary blue** for structure/actions, **coral accent** for primary CTAs
- **Status rail** motif — colored dots/pills for lead status, task status, and deal stage (blue = new/open, amber = in-progress, green = won/completed, red = lost)
- **Sora** for headings, **Inter** for body text

## Testing

Manual testing is the primary method (as specified). Optional: add Jest component tests under `src/__tests__/`.

## What This Demonstrates (for interviews)

- React Router protected routes + role-based UI rendering
- Centralized Axios instance with request/response interceptors (JWT attach + auto-logout)
- Context API for global auth state (no external state library needed)
- Reusable components (Modal, StatusPill, Layout) shared across 5 CRUD pages
- Clean separation of concerns: services (API) / pages (views) / components (UI) / utils (cross-cutting logic)
