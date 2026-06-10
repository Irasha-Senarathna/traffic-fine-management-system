# Backend API Test Cases

**Tester:** Chamodi  
**Tool:** Postman  
**Base URL:** http://localhost:8080

---

## Authentication Tests

| TC ID | Test Name | Steps | Expected Result | Actual Result | Status |
|-------|-----------|-------|-----------------|---------------|--------|
| TC-B01 | Register with valid details | POST /api/auth/register with valid data | 201 Created, user saved | | ⬜ |
| TC-B02 | Register with duplicate email | POST /api/auth/register same email twice | 400 Bad Request | | ⬜ |
| TC-B03 | Login with correct credentials | POST /api/auth/login with correct details | 200 OK, JWT token returned | | ⬜ |
| TC-B04 | Login with wrong password | POST /api/auth/login wrong password | 401 Unauthorized | | ⬜ |

## Fine Management Tests

| TC ID | Test Name | Steps | Expected Result | Actual Result | Status |
|-------|-----------|-------|-----------------|---------------|--------|
| TC-B05 | Issue a fine (officer logged in) | POST /api/fines with valid token | 201 Created | | ⬜ |
| TC-B06 | Issue fine without auth token | POST /api/fines no token | 403 Forbidden | | ⬜ |
| TC-B07 | Get fines for a user | GET /api/fines/{userId} | 200 OK, fines list | | ⬜ |
| TC-B08 | Pay a fine (valid fine ID) | POST /api/payments valid ID | 200 OK, status PAID | | ⬜ |
| TC-B09 | Pay already paid fine | POST /api/payments same ID twice | 400 Bad Request | | ⬜ |

## SMS Notification Tests

| TC ID | Test Name | Steps | Expected Result | Actual Result | Status |
|-------|-----------|-------|-----------------|---------------|--------|
| TC-B10 | SMS sent after payment | Complete a payment | Officer receives SMS | | ⬜ |
| TC-B11 | SMS content check | Check received SMS | Contains fine reference + driver name | | ⬜ |
| TC-B12 | Invalid phone number | POST /api/sms with invalid number | Error handled gracefully | | ⬜ |

## Status Key
✅ Pass | ❌ Fail | ⬜ Not Tested Yet