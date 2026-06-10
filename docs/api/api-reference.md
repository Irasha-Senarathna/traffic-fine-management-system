# 📡 API Reference — Traffic Fine Management System

**Maintained by:** Chamodi  
**Base URL:** http://localhost:8080/api  
**Authentication:** JWT Bearer Token

---

## 🔐 Authentication Endpoints

### Register User
```
POST /api/auth/register
```
**Request Body:**
```json
{
  "name": "John Silva",
  "email": "john@gmail.com",
  "password": "Test@1234",
  "phone": "+94771234567"
}
```
**Response:**
```json
{
  "message": "User registered successfully",
  "status": 201
}
```

---

### Login
```
POST /api/auth/login
```
**Request Body:**
```json
{
  "email": "john@gmail.com",
  "password": "Test@1234"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "status": 200
}
```

---

## 🚦 Fine Management Endpoints

### Get Fine by Reference Number
```
GET /api/fines/{referenceNumber}
```
**Headers:**
```
Authorization: Bearer {token}
```
**Response:**
```json
{
  "id": 1,
  "referenceNumber": "TF-2024-001",
  "category": "SPEEDING",
  "amount": 2500.00,
  "status": "UNPAID",
  "officerPhone": "+94771234567"
}
```

---

### Issue a Fine (Officer)
```
POST /api/fines
```
**Headers:**
```
Authorization: Bearer {token}
```
**Request Body:**
```json
{
  "driverName": "John Silva",
  "vehiclePlate": "CAB-1234",
  "category": "SPEEDING",
  "amount": 2500.00,
  "officerPhone": "+94771234567"
}
```
**Response:**
```json
{
  "referenceNumber": "TF-2024-001",
  "message": "Fine issued successfully",
  "status": 201
}
```

---

## 💳 Payment Endpoints

### Pay a Fine
```
POST /api/payments
```
**Headers:**
```
Authorization: Bearer {token}
```
**Request Body:**
```json
{
  "fineReference": "TF-2024-001",
  "cardNumber": "4111111111111111",
  "expiryDate": "12/26",
  "cvv": "123"
}
```
**Response:**
```json
{
  "message": "Payment successful. SMS sent to officer.",
  "status": 200
}
```

---

## 📱 SMS Endpoints

### Send Payment Confirmation SMS
```
POST /api/sms/payment-confirmation
```
**Parameters:**
```
officerPhone = +94771234567
driverName   = John Silva
fineReference = TF-2024-001
```
**Response:**
```json
{
  "message": "SMS sent successfully",
  "status": 200
}
```

---

## 📊 Admin Endpoints

### Get All Fines
```
GET /api/admin/fines
```
**Headers:**
```
Authorization: Bearer {admin_token}
```
**Response:**
```json
[
  {
    "id": 1,
    "referenceNumber": "TF-2024-001",
    "category": "SPEEDING",
    "amount": 2500.00,
    "status": "PAID",
    "district": "Colombo"
  }
]
```

---

### Get District wise Collections
```
GET /api/admin/collections/district
```
**Response:**
```json
[
  { "district": "Colombo", "total": 125000.00 },
  { "district": "Kandy", "total": 87500.00 },
  { "district": "Galle", "total": 62000.00 }
]
```

---

## ⚠️ Error Responses

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request / validation error |
| 401 | Unauthorized / wrong password |
| 403 | Forbidden / no token |
| 404 | Not found |
| 500 | Server error |

---

## 📝 Notes
- All requests except register and login require JWT token
- Token must be included in Authorization header
- Ask Ira to update this file when new endpoints are added