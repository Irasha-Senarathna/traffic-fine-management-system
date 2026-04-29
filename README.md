# 🚦 Traffic Fine Management System

## 📌 Project Overview

This system is developed to digitize traffic fine payments in Sri Lanka.
It allows drivers to pay fines using a **mobile app (on-the-spot)** or **web portal**, while admins monitor collections through a dashboard.

---

# 🏗️ System Architecture

Client Applications:

* 📱 Mobile App (Flutter)
* 🌐 User Web App (React)
* 🧑‍💼 Admin Portal (React)

⬇ communicate via REST API ⬇

Backend:

* Spring Boot (Java)
* JWT Authentication
* MySQL Database

⬇

External Service:

* SMS Notification (Mock / API)

---

# ⚙️ Technologies Used

## Backend

* Java 17
* Spring Boot
* Spring Web
* Spring Data JPA
* Spring Security (JWT)
* MySQL

## Frontend

* React.js
* Axios (API calls)

## Mobile

* Flutter (Dart)

## Tools

* Git & GitHub
* Postman
* IntelliJ IDEA / VS Code

---

# 📂 Project Structure

```id="proj-structure"
traffic-fine-management-system/
│
├── backend/
│   ├── src/main/java/com/traffic/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── dto/
│   │   ├── security/
│   │   └── config/
│   └── application.properties
│
├── web-user/
├── admin-portal/
├── mobile-app/
├── docs/
└── README.md
```

---

# 🚀 HOW TO START (ALL MEMBERS)

## Step 1: Clone Repository

```id="clone"
git clone <repo-link>
cd traffic-fine-management-system
```

## Step 2: Switch to develop branch

```id="branch"
git checkout develop
git pull origin develop
```

## Step 3: Create your feature branch

```id="feature"
git checkout -b feature/your-task-name
```

---

# 👥 TEAM TASKS (DETAILED WITH FILES & TECH)

---

# 👑 IRA — Backend Lead + Git Manager

## 🔧 Technologies:

* Spring Boot
* Spring Security (JWT)
* MySQL
* JPA

## 📁 Files to Work On:

```
backend/
├── config/
├── security/
├── controller/AuthController.java
├── model/User.java
├── repository/UserRepository.java
```

## ✅ Tasks:

### 1. Setup Backend Project

* Configure `application.properties`
* Setup MySQL connection

### 2. Implement Authentication (JWT)

Files:

* `security/JwtUtil.java`
* `security/JwtFilter.java`
* `AuthController.java`

Features:

* Register user
* Login user
* Generate JWT token

---

### 3. Define Base Architecture

* Create packages: controller, service, repository
* Setup global exception handling

---

### 4. API Documentation

Create:

```
docs/api-design.md
```

---

### 5. Git Management

* Create branches
* Merge PRs
* Ensure code quality

---

# 👨‍💻 OSH — Backend Developer (Fine + Payment APIs)

## 🔧 Technologies:

* Spring Boot
* JPA / Hibernate

## 📁 Files:

```
controller/FineController.java
controller/PaymentController.java
service/FineService.java
service/PaymentService.java
repository/FineRepository.java
repository/PaymentRepository.java
model/Fine.java
model/Payment.java
```

## ✅ Tasks:

### 1. Fine Management

* Create fine
* Fetch fine by reference

### 2. Payment System

* Validate fine
* Process payment
* Update status

### 3. Logic Handling

* Prevent duplicate payments
* Validate inputs

---

# 🌐 NILUMINDA — User Web App

## 🔧 Technologies:

* React
* Axios

## 📁 Files:

```
web-user/src/
├── pages/
│   ├── Login.js
│   ├── SearchFine.js
│   ├── Payment.js
│   └── Success.js
├── services/api.js
```

## ✅ Tasks:

### 1. Setup React App

```id="react"
npx create-react-app web-user
```

### 2. Implement Pages

* Login page
* Search fine page
* Payment page
* Confirmation page

### 3. API Integration

* Use Axios
* Connect to backend APIs

---

# 🧑‍💼 CHAMO — Admin Portal

## 🔧 Technologies:

* React
* Chart libraries (optional)

## 📁 Files:

```
admin-portal/src/
├── pages/
│   ├── Dashboard.js
│   ├── Reports.js
│   └── Login.js
```

## ✅ Tasks:

### 1. Dashboard

* Show total payments
* Show district/category summaries

### 2. Reports

* Payment history table

### 3. Admin Auth

* Secure routes using JWT

---

# 📱 DIMUTHU — Mobile App

## 🔧 Technologies:

* Flutter (Dart)

## 📁 Files:

```
mobile-app/lib/
├── screens/
│   ├── login_screen.dart
│   ├── fine_screen.dart
│   ├── payment_screen.dart
│   └── success_screen.dart
├── services/api_service.dart
```

## ✅ Tasks:

### 1. Setup Flutter Project

```id="flutter"
flutter create mobile-app
```

### 2. Screens

* Login
* Enter fine reference
* Payment
* Confirmation

### 3. API Integration

* Connect with backend

---

# 🧪 KAVI — Testing + Documentation

## 🔧 Technologies:

* Postman
* GitHub Issues

## 📁 Files:

```
docs/testing.md
docs/setup-guide.md
```

## ✅ Tasks:

### 1. API Testing

* Test all endpoints
* Create Postman collection

### 2. Integration Testing

* Check frontend + backend

### 3. Documentation

* Setup guide
* API usage guide

---

# 🔄 DEVELOPMENT FLOW

```id="flow"
1. Backend APIs ready
2. Frontend & Mobile integrate APIs
3. Testing & bug fixing
4. Final merge to develop
5. Merge to main
```

---

# 🔔 SMS FEATURE (MINIMUM REQUIREMENT)

* Simulate SMS sending
* Print message in console OR use API

Example:

```
"Payment successful for Fine #1234"
```

---

# 📊 FINAL SUBMISSION CHECKLIST

✔ Backend running
✔ Web app working
✔ Mobile app working
✔ Admin dashboard working
✔ SMS triggered
✔ GitHub commits (ALL members)
✔ Documentation complete

---

# 🎯 FINAL NOTE

This project must demonstrate:

* Proper architecture
* Clean code structure
* Team collaboration using Git
* Fully working system

---
