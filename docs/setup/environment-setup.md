# 🛠️ Environment Setup Guide

**Maintained by:** Chamodi  
**Last Updated:** June 2026

---

## Prerequisites

Make sure you have these installed before starting:

| Tool | Version | Download |
|------|---------|----------|
| Java JDK | 17+ | https://adoptium.net |
| Node.js | 18+ | https://nodejs.org |
| Flutter SDK | 3.0+ | https://flutter.dev |
| MySQL | 8.0+ | https://dev.mysql.com |
| Git | Latest | https://git-scm.com |
| VS Code | Latest | https://code.visualstudio.com |
| Postman | Latest | https://postman.com |
| Android Studio | Latest | https://developer.android.com/studio |

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/Irasha-Senarathna/traffic-fine-management-system.git
cd traffic-fine-management-system
```

---

## Step 2 — Database Setup

1. Open MySQL and create the database:
```sql
CREATE DATABASE traffic_fine_db;
```
2. Run the schema file:
```bash
mysql -u root -p traffic_fine_db < docs/database/schema.sql
```

---

## Step 3 — Backend Setup

```bash
cd backend
```
Open `src/main/resources/application.properties` and update:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/traffic_fine_db
spring.datasource.username=root
spring.datasource.password=your_password

twilio.account.sid=your_twilio_sid
twilio.auth.token=your_twilio_token
twilio.phone.number=your_twilio_number
```
Then run:
```bash
./mvnw spring-boot:run
```
Backend runs at: **http://localhost:8080** ✅

---

## Step 4 — Web User Portal Setup

```bash
cd web-user
npm install
npm start
```
Runs at: **http://localhost:3000** ✅

---

## Step 5 — Admin Portal Setup

```bash
cd admin-portal
npm install
npm start
```
Runs at: **http://localhost:3001** ✅

---

## Step 6 — Mobile App Setup

```bash
cd mobile-app
flutter pub get
flutter run
```
Make sure Android emulator is running first! ✅

---

## ⚠️ Common Issues

| Problem | Solution |
|---------|----------|
| Backend won't start | Check MySQL is running |
| npm install fails | Delete node_modules/ and try again |
| Flutter packages missing | Run flutter pub get |
| Port 8080 already in use | Kill the process using that port |
| SMS not sending | Check Twilio credentials in application.properties |

---

## ✅ Everything Running Checklist

- [ ] MySQL database running
- [ ] Backend running on port 8080
- [ ] Web portal running on port 3000
- [ ] Admin portal running on port 3001
- [ ] Mobile app running on emulator