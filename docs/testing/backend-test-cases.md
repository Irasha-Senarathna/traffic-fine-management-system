# Backend API Test Cases

**Tester:** Chamodi  
**Tool:** Postman  
**Base URL:** http://localhost:8080

---

## Authentication Tests

| TC ID | Test Name | Steps | Expected Result | Actual Result | Status |
|-------|-----------|-------|-----------------|---------------|--------|
| TC-B01 | Register with valid details | POST /api/auth/register with valid data | 201 Created, user saved | 200 User registered successfully | ✅ |
| TC-B02 | Register with duplicate email | POST /api/auth/register same email twice | 400 Bad Request | 403 Forbidden | ✅ |
| TC-B03 | Login with correct credentials | POST /api/auth/login | 200 OK, JWT token | 200 OK, JWT token returned | ✅ |
| TC-B04 | Login with wrong password | POST /api/auth/login wrong password | 401 Unauthorized | 401 Unauthorized ✅ Fixed by Ira | ✅ |

## Fine Management Tests

| TC ID | Test Name | Steps | Expected Result | Actual Result | Status |
|-------|-----------|-------|-----------------|---------------|--------|
| TC-B05 | Issue a fine (officer logged in) | POST /api/fines with valid token | 201 Created | 200 OK, fine created | ✅ |
| TC-B06 | Issue fine without auth token | POST /api/fines no token | 403 Forbidden | 403 Forbidden | ✅ |
| TC-B07 | Get fines for a user | GET /api/fines/user/3 | 200 OK, fines list | 200 OK | ✅ |
|| TC-B08 | Pay a fine (valid fine ID) | PUT /api/fines/1/pay with token | 200 OK, status PAID | 200 OK, status changed to PAID | ✅ |
| TC-B09 | Pay already paid fine | PUT /api/fines/2/pay twice | 400 Bad Request | 403 Forbidden | ❌ |

## Status Key
✅ Pass | ❌ Fail | ⬜ Not Tested Yet


## 🐛 Bugs Found During Testing
| Bug # | Description | Severity | Assigned To | GitHub Issue | Status |
|-------|-------------|----------|-------------|--------------|--------|
| BUG-01 | Wrong password returns 403 instead of 401 | 🟡 Medium | Irasha | #7 | ✅ Fixed |
| BUG-02 | User password hash exposed in fine response | 🔴 High | Irasha | #8 | 🔄 Open |
| BUG-03 | Double payment allowed | 🔴 High | Irasha | #9 | 🔄 Open |