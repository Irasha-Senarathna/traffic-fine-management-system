# 🚦 Traffic Fine Management System

A full-stack traffic fine management platform built as a group project. The system allows traffic officers to issue fines, citizens to view and pay fines online or via mobile, and administrators to manage the entire system.

---

## 👥 Team Members

| Name | Role | Module |
|------|------|--------|
| Ira (Irasha) | Backend Developer + GitHub Owner | `backend/` |
| Niluminda | Frontend Developer | `web-user/` |
| Kavi | Frontend Developer | `admin-portal/` |
| Osh | Mobile Developer | `mobile-app/` |
| Chamo | Documentation + QA Tester | `docs/` |
| Dimuthu | DevOps + Database | Database Schema + CI/CD |

---

## 🏗️ Project Structure

```
traffic-fine-management-system/
│
├── backend/              # Spring Boot REST API
├── web-user/             # React app for public users
├── admin-portal/         # React app for admin/officers
├── mobile-app/           # Flutter mobile app
├── docs/                 # Project documentation & test cases
└── README.md             # This file
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.x |
| Frontend (User) | React 18, Axios |
| Frontend (Admin) | React 18, Axios |
| Mobile | Flutter 3.x, Dart |
| Database | MySQL 8.x |
| Auth | Spring Security + JWT |
| API Docs | Swagger / OpenAPI |

---

## 🌐 System Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Web User App  │     │  Admin Portal   │     │   Mobile App    │
│   (React)       │     │  (React)        │     │   (Flutter)     │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                        │
         └───────────────────────┼────────────────────────┘
                                 │  REST API (HTTP/JSON)
                    ┌────────────▼────────────┐
                    │   Spring Boot Backend   │
                    │   Port: 8080            │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │      MySQL Database      │
                    │      Port: 3306          │
                    └─────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites — install these before anything else

- **Java 17+** — [Download](https://www.oracle.com/java/technologies/downloads/)
- **Maven 3.8+** — [Download](https://maven.apache.org/download.cgi)
- **Node.js 18+** and **npm** — [Download](https://nodejs.org/)
- **Flutter 3.x** — [Download](https://flutter.dev/docs/get-started/install)
- **MySQL 8.x** — [Download](https://dev.mysql.com/downloads/)
- **Git** — [Download](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Irasha-Senarathna/traffic-fine-management-system.git
cd traffic-fine-management-system
```

### 2. Set Up the Database

```bash
mysql -u root -p
```
```sql
CREATE DATABASE traffic_fine_db;
EXIT;
```

Then run the schema:
```bash
mysql -u root -p traffic_fine_db < docs/database/schema.sql
```

### 3. Start Each Module

Each module has its own README with detailed setup instructions:

- **Backend** → [`backend/README.md`](./backend/README.md)
- **Web User App** → [`web-user/README.md`](./web-user/README.md)
- **Admin Portal** → [`admin-portal/README.md`](./admin-portal/README.md)
- **Mobile App** → [`mobile-app/README.md`](./mobile-app/README.md)
- **Docs & Testing** → [`docs/README.md`](./docs/README.md)

---

## 🔗 API Base URL

| Environment | URL |
|-------------|-----|
| Local Development | `http://localhost:8080/api` |
| Swagger UI | `http://localhost:8080/swagger-ui.html` |

---

## 🌿 Git Branching Strategy

We follow a **feature branch workflow**:

```
main
 ├── feature/backend-api         (Ira)
 ├── feature/web-user-frontend   (Niluminda)
 ├── feature/admin-portal        (Kavi)
 ├── feature/mobile-app          (Osh)
 ├── feature/docs                (Chamo)
 └── feature/database-setup      (Dimuthu)
```

### Rules
- ❌ Never commit directly to `main`
- ✅ Always open a Pull Request and request Ira to review before merging
- ✅ Pull the latest `main` every morning before starting work
- ✅ Write clear commit messages: `Add: user login API`, `Fix: payment bug`, `Update: README`

### Daily Workflow

```bash
# 1. Get latest changes from main
git pull origin main

# 2. Switch to your branch
git checkout feature/your-branch-name

# 3. Do your work, then commit
git add .
git commit -m "Add: short description of what you did"

# 4. Push to GitHub
git push origin feature/your-branch-name

# 5. Open a Pull Request on GitHub when ready
```

---

## 📋 Core Features

### Public Users (web + mobile)
- Register and log in with their account
- View personal fine history by NIC / vehicle number
- Pay fines online
- Download fine receipts as PDF

### Traffic Officers / Admins
- Issue new traffic fines against a vehicle
- Search fines by vehicle number or NIC
- Update fine status (paid / unpaid / disputed)
- View reports and dashboards

---

## 📁 Key API Endpoints (Summary)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | Login — returns JWT token |
| GET | `/api/fines` | Get all fines (admin only) |
| GET | `/api/fines/user/{id}` | Get fines for a specific user |
| POST | `/api/fines` | Issue a new fine (officer) |
| PUT | `/api/fines/{id}/pay` | Mark a fine as paid |
| GET | `/api/users` | Get all users (admin only) |
| DELETE | `/api/users/{id}` | Delete a user (admin only) |

Full API docs: `http://localhost:8080/swagger-ui.html`

---

## 🐛 Reporting Issues

1. Go to the **Issues** tab on GitHub
2. Click **New Issue**
3. Describe the bug: what happened, what you expected, steps to reproduce
4. Assign it to the relevant team member

---

*Last updated: May 2026 | Group Project — TFMS Team*
