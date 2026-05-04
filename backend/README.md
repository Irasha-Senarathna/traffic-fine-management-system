# 🖥️ Backend — Spring Boot REST API

**Owner:** Ira (Irasha)
**Branch:** `feature/backend-api`
**Tech:** Java 17, Spring Boot 3.x, Spring Security, JWT, MySQL, Swagger

---

## 📁 Folder Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/tfms/
│   │   │   ├── TfmsApplication.java         # Main entry point
│   │   │   ├── config/
│   │   │   │   ├── SecurityConfig.java       # Spring Security + JWT config
│   │   │   │   └── SwaggerConfig.java        # Swagger/OpenAPI setup
│   │   │   ├── controller/
│   │   │   │   ├── AuthController.java       # Login & Register
│   │   │   │   ├── FineController.java       # Fine CRUD operations
│   │   │   │   ├── UserController.java       # User management
│   │   │   │   └── PaymentController.java    # Payment processing
│   │   │   ├── model/
│   │   │   │   ├── User.java                 # User entity
│   │   │   │   ├── Fine.java                 # Fine entity
│   │   │   │   ├── Payment.java              # Payment entity
│   │   │   │   └── Role.java                 # Role enum (USER, OFFICER, ADMIN)
│   │   │   ├── repository/
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── FineRepository.java
│   │   │   │   └── PaymentRepository.java
│   │   │   ├── service/
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── FineService.java
│   │   │   │   ├── UserService.java
│   │   │   │   └── PaymentService.java
│   │   │   ├── dto/
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── RegisterRequest.java
│   │   │   │   ├── FineDTO.java
│   │   │   │   └── PaymentDTO.java
│   │   │   └── security/
│   │   │       ├── JwtUtil.java              # JWT token helper
│   │   │       └── JwtFilter.java            # JWT request filter
│   │   └── resources/
│   │       └── application.properties        # DB config, JWT secret
│   └── test/
│       └── java/com/tfms/                    # Unit tests
├── pom.xml                                   # Maven dependencies
└── README.md                                 # This file
```

---

## ⚙️ Setup Instructions

### Step 1 — Configure the Database

Open `src/main/resources/application.properties` and update with your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/traffic_fine_db
spring.datasource.username=root
spring.datasource.password=your_password_here
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT Secret (change this to a long random string)
jwt.secret=tfms_super_secret_key_change_this_in_production
jwt.expiration=86400000

# Swagger
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html

server.port=8080
```

### Step 2 — Install Dependencies and Run

```bash
# Go into the backend folder
cd backend

# Build the project (downloads all dependencies)
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start at: `http://localhost:8080`

### Step 3 — Verify It's Working

Open your browser and go to:
- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **Health check:** `http://localhost:8080/api/health`

---

## 📦 Maven Dependencies (pom.xml)

Add these inside your `<dependencies>` block in `pom.xml`:

```xml
<!-- Spring Boot Web -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- Spring Data JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- MySQL Connector -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>

<!-- Swagger / OpenAPI -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.1.0</version>
</dependency>

<!-- Lombok (reduces boilerplate) -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

---

## 🔗 API Endpoints Reference

### Auth
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | `{name, email, password, nic}` | Register new user |
| POST | `/api/auth/login` | `{email, password}` | Login — returns JWT token |

### Fines
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/fines` | Admin | Get all fines |
| GET | `/api/fines/{id}` | Any | Get fine by ID |
| GET | `/api/fines/user/{userId}` | User/Admin | Get fines for a user |
| GET | `/api/fines/vehicle/{plate}` | Admin | Get fines by vehicle plate |
| POST | `/api/fines` | Officer/Admin | Issue a new fine |
| PUT | `/api/fines/{id}` | Officer/Admin | Update fine details |
| DELETE | `/api/fines/{id}` | Admin | Delete a fine |

### Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payments` | User | Pay a fine |
| GET | `/api/payments/{fineId}` | User/Admin | Get payment for a fine |
| PUT | `/api/fines/{id}/pay` | User | Mark fine as paid |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users` | Admin | Get all users |
| GET | `/api/users/{id}` | Admin | Get user by ID |
| PUT | `/api/users/{id}` | Admin | Update user |
| DELETE | `/api/users/{id}` | Admin | Delete user |

---

## 📝 How to Use JWT Authentication

After login, you receive a token:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

Include this in every protected request as a header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

Niluminda, Kavi, and Osh: when calling the API from React or Flutter, store the token (in localStorage or Flutter SharedPreferences) and attach it to every API call after login.

---

## ✅ Ira's Task Checklist

- [x] Create GitHub repository
- [x] Set up folder structure
- [ ] Initialize Spring Boot project (pom.xml)
- [ ] Configure MySQL connection
- [ ] Create User, Fine, Payment entities
- [ ] Implement JWT authentication
- [ ] Build Fine CRUD API
- [ ] Build Payment API
- [ ] Add Swagger documentation
- [ ] Share Postman collection with team
- [ ] Write unit tests for service layer

---

## 🐛 Common Issues

**Cannot connect to MySQL:**
- Make sure MySQL service is running: `net start mysql` (Windows) or `sudo service mysql start` (Linux/Mac)
- Double-check your password in `application.properties`

**Port 8080 already in use:**
- Change the port in `application.properties`: `server.port=8081`

**Build fails:**
- Run `mvn clean` first, then `mvn install` again
