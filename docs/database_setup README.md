# 🗄️ Database & DevOps Setup

**Owner:** Dimuthu
**Branch:** `feature/database-setup`
**Tech:** MySQL 8.x, GitHub Actions (CI/CD), Docker (optional)

Dimuthu is responsible for designing the full MySQL database schema, writing the SQL scripts the whole team will use, managing environment configuration files, and setting up any DevOps tooling (CI/CD pipeline, Docker). Every other module depends on this work — so database setup should be completed early.

---

## 📁 What Dimuthu Creates (inside the `docs/` folder)

```
docs/
├── database/
│   ├── schema.sql              # Full database schema — CREATE TABLE statements
│   ├── seed-data.sql           # Sample/dummy data for testing
│   └── er-diagram.png          # ER diagram image (draw using draw.io or dbdiagram.io)
├── env/
│   ├── backend.env.example     # Example environment variables for backend
│   └── setup-guide.md          # Step-by-step DB setup instructions for the team
└── ...
```

> Dimuthu does NOT have his own separate top-level folder. His deliverables live inside `docs/database/` and config files he helps set up inside `backend/src/main/resources/`.

---

## 🧩 Database Design — Tables

### 1. `users` table
Stores all registered citizens, officers, and admins.

```sql
CREATE TABLE users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)         NOT NULL,
    email       VARCHAR(150)         NOT NULL UNIQUE,
    password    VARCHAR(255)         NOT NULL,  -- bcrypt hashed
    nic         VARCHAR(20)          NOT NULL UNIQUE,
    phone       VARCHAR(15),
    role        ENUM('USER','OFFICER','ADMIN') DEFAULT 'USER',
    created_at  TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    is_active   BOOLEAN              DEFAULT TRUE
);
```

### 2. `fines` table
Stores every traffic fine issued.

```sql
CREATE TABLE fines (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    fine_number     VARCHAR(20)      NOT NULL UNIQUE,  -- e.g. TF-2026-00001
    user_id         BIGINT,
    vehicle_plate   VARCHAR(15)      NOT NULL,
    nic             VARCHAR(20)      NOT NULL,
    violation_type  VARCHAR(100)     NOT NULL,
    amount          DECIMAL(10,2)    NOT NULL,
    location        VARCHAR(255),
    violation_date  DATE             NOT NULL,
    issued_by       BIGINT,                            -- officer's user ID
    status          ENUM('UNPAID','PAID','DISPUTED')   DEFAULT 'UNPAID',
    notes           TEXT,
    created_at      TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)   REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (issued_by) REFERENCES users(id) ON DELETE SET NULL
);
```

### 3. `payments` table
Records every payment made against a fine.

```sql
CREATE TABLE payments (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    fine_id         BIGINT           NOT NULL,
    user_id         BIGINT           NOT NULL,
    amount_paid     DECIMAL(10,2)    NOT NULL,
    payment_method  ENUM('ONLINE','CASH','BANK') DEFAULT 'ONLINE',
    payment_date    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    transaction_ref VARCHAR(100),                      -- reference number
    FOREIGN KEY (fine_id)  REFERENCES fines(id)   ON DELETE CASCADE,
    FOREIGN KEY (user_id)  REFERENCES users(id)   ON DELETE CASCADE
);
```

### 4. `violation_types` table (optional but useful)
A lookup table so violation types are consistent.

```sql
CREATE TABLE violation_types (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    default_fine DECIMAL(10,2)
);
```

---

## 📄 Full schema.sql File

Create this file at `docs/database/schema.sql`:

```sql
-- Traffic Fine Management System
-- Database Schema
-- Created by: Dimuthu
-- Last updated: May 2026

CREATE DATABASE IF NOT EXISTS traffic_fine_db;
USE traffic_fine_db;

-- ─────────────────────────────────────────────
-- Table: users
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,
    nic         VARCHAR(20)   NOT NULL UNIQUE,
    phone       VARCHAR(15),
    role        ENUM('USER','OFFICER','ADMIN') NOT NULL DEFAULT 'USER',
    is_active   BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- Table: violation_types
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS violation_types (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100)   NOT NULL,
    default_fine DECIMAL(10,2)  NOT NULL DEFAULT 0.00
);

-- ─────────────────────────────────────────────
-- Table: fines
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fines (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    fine_number     VARCHAR(20)     NOT NULL UNIQUE,
    user_id         BIGINT,
    vehicle_plate   VARCHAR(15)     NOT NULL,
    nic             VARCHAR(20)     NOT NULL,
    violation_type  VARCHAR(100)    NOT NULL,
    amount          DECIMAL(10,2)   NOT NULL,
    location        VARCHAR(255),
    violation_date  DATE            NOT NULL,
    issued_by       BIGINT,
    status          ENUM('UNPAID','PAID','DISPUTED') NOT NULL DEFAULT 'UNPAID',
    notes           TEXT,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)   REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (issued_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ─────────────────────────────────────────────
-- Table: payments
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    fine_id         BIGINT          NOT NULL,
    user_id         BIGINT          NOT NULL,
    amount_paid     DECIMAL(10,2)   NOT NULL,
    payment_method  ENUM('ONLINE','CASH','BANK') NOT NULL DEFAULT 'ONLINE',
    payment_date    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    transaction_ref VARCHAR(100),
    FOREIGN KEY (fine_id)  REFERENCES fines(id)  ON DELETE CASCADE,
    FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE
);
```

---

## 🌱 Seed Data File

Create `docs/database/seed-data.sql` with dummy data so the team can test without having to manually create records:

```sql
USE traffic_fine_db;

-- Sample violation types
INSERT INTO violation_types (name, default_fine) VALUES
('Speeding',             5000.00),
('Running Red Light',    7500.00),
('No Seatbelt',          2500.00),
('Using Phone While Driving', 5000.00),
('Illegal Parking',      3000.00),
('Drunk Driving',       25000.00),
('No Valid License',    10000.00),
('Wrong Lane',           3500.00);

-- Sample admin user (password: Admin@1234 — bcrypt hashed)
INSERT INTO users (name, email, password, nic, phone, role) VALUES
('Admin User', 'admin@tfms.lk',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LjTbqX4Rrye',
 '199012345678', '0771234567', 'ADMIN');

-- Sample traffic officer
INSERT INTO users (name, email, password, nic, phone, role) VALUES
('Officer Perera', 'officer@tfms.lk',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LjTbqX4Rrye',
 '198756781234', '0777654321', 'OFFICER');

-- Sample regular users
INSERT INTO users (name, email, password, nic, phone, role) VALUES
('Kamal Silva',  'kamal@gmail.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LjTbqX4Rrye',
 '199234567890', '0712345678', 'USER'),
('Nimal Perera', 'nimal@gmail.com',
 '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LjTbqX4Rrye',
 '198876543210', '0723456789', 'USER');

-- Sample fines
INSERT INTO fines (fine_number, user_id, vehicle_plate, nic, violation_type, amount, location, violation_date, issued_by, status) VALUES
('TF-2026-00001', 3, 'CAB-1234', '199234567890', 'Speeding',         5000.00, 'Colombo - Kandy Road, Kegalle', '2026-04-10', 2, 'UNPAID'),
('TF-2026-00002', 4, 'WP-KA-5678', '198876543210', 'Running Red Light', 7500.00, 'Galle Road, Colombo 03',        '2026-04-15', 2, 'PAID'),
('TF-2026-00003', 3, 'CAB-1234', '199234567890', 'No Seatbelt',      2500.00, 'Negombo Road, Ja-Ela',          '2026-05-01', 2, 'UNPAID');

-- Sample payment (for the PAID fine)
INSERT INTO payments (fine_id, user_id, amount_paid, payment_method, transaction_ref) VALUES
(2, 4, 7500.00, 'ONLINE', 'TXN-20260415-88921');
```

> **All sample passwords are:** `Admin@1234`
> Remind Ira to use this bcrypt hash when testing, or Ira can create a test endpoint to generate hashes.

---

## ⚙️ Environment Config Helper

Help Ira set up `backend/src/main/resources/application.properties`. Create a safe example version at `docs/env/backend.env.example`:

```properties
# Copy this to: backend/src/main/resources/application.properties
# Fill in your own values — NEVER commit real passwords to GitHub

spring.datasource.url=jdbc:mysql://localhost:3306/traffic_fine_db
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

jwt.secret=CHANGE_THIS_TO_A_LONG_RANDOM_SECRET_STRING
jwt.expiration=86400000

server.port=8080

springdoc.swagger-ui.path=/swagger-ui.html
```

Also make sure `application.properties` is listed in `.gitignore` so no one accidentally pushes real passwords:

```
# In the root .gitignore — add this line:
backend/src/main/resources/application.properties
```

---

## 🔁 GitHub Actions — CI Pipeline (optional but impressive)

Create `.github/workflows/ci.yml` in the root of the repo to automatically build the backend whenever someone pushes code:

```yaml
name: Build Backend

on:
  push:
    branches: [ main, feature/* ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Java 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Build with Maven
        working-directory: ./backend
        run: mvn clean install -DskipTests

      - name: Run tests
        working-directory: ./backend
        run: mvn test
```

This will show a green ✅ or red ❌ on every Pull Request — great for a project demo!

---

## 🐳 Docker Setup (optional)

If the team wants to run the database without installing MySQL locally, create a `docker-compose.yml` in the root:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: tfms_mysql
    environment:
      MYSQL_ROOT_PASSWORD: root1234
      MYSQL_DATABASE: traffic_fine_db
    ports:
      - "3306:3306"
    volumes:
      - ./docs/database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
```

To start:
```bash
docker-compose up -d
```

The database will be ready at `localhost:3306` with the schema already loaded.

---

## ✅ Dimuthu's Task Checklist

- [ ] Design all database tables on paper first (draw the ER diagram)
- [ ] Create `docs/database/schema.sql` with all CREATE TABLE statements
- [ ] Create `docs/database/seed-data.sql` with sample data for testing
- [ ] Draw ER diagram using https://dbdiagram.io and export as PNG → save as `docs/database/er-diagram.png`
- [ ] Create `docs/env/backend.env.example` for safe sharing of config
- [ ] Add `application.properties` to `.gitignore`
- [ ] Share `schema.sql` with Ira so backend JPA entities match the DB
- [ ] Set up GitHub Actions CI file (`.github/workflows/ci.yml`)
- [ ] (Optional) Add `docker-compose.yml` for easy MySQL setup
- [ ] Test that the schema runs without errors on a fresh MySQL install

---

## 🛠️ Tools You Need

- **MySQL Workbench** (GUI for MySQL) — https://dev.mysql.com/downloads/workbench/
- **dbdiagram.io** (free, browser-based ER diagram tool) — https://dbdiagram.io
- **MySQL** installed locally (port 3306)
- **VS Code** or any text editor for editing `.sql` and `.yml` files

---

## 📢 Important Notes for the Team

- **Run `schema.sql` before starting the backend for the first time**
- **Run `seed-data.sql` after schema to get test data**
- If Ira changes an entity (adds/removes a column), Dimuthu updates `schema.sql` to match
- The `application.properties` file must NEVER be pushed to GitHub — it contains passwords
- If Dimuthu changes the schema after the team has already set up their databases, he must communicate clearly in the group chat and provide an `ALTER TABLE` update script

---

## 🐛 Common Issues

**MySQL won't start:**
- Windows: open Services app → find MySQL → click Start
- Mac/Linux: `sudo service mysql start` or `brew services start mysql`

**`Access denied for user 'root'`:**
- Reset MySQL root password or use a different user account
- Make sure the password in `application.properties` matches exactly

**Schema already exists error:**
- The `CREATE TABLE IF NOT EXISTS` in `schema.sql` prevents this — safe to re-run
- To reset completely: `DROP DATABASE traffic_fine_db;` then re-create

---

*Owner: Dimuthu | Branch: `feature/database-setup` | TFMS Group Project 2026*
