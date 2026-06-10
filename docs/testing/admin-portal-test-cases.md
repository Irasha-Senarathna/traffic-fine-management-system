# Admin Portal Test Cases

**Tester:** Chamodi  
**Tool:** Browser (Chrome)  
**URL:** http://localhost:3001

---

## Login Tests

| TC ID | Test Name | Steps | Expected Result | Actual Result | Status |
|-------|-----------|-------|-----------------|---------------|--------|
| TC-A01 | Admin login with correct credentials | Enter admin email + password | Redirect to dashboard | | ⬜ |
| TC-A02 | Normal user tries admin login | Enter normal user credentials | Access denied message | | ⬜ |
| TC-A03 | Login with empty fields | Click login without filling | Validation errors shown | | ⬜ |
| TC-A04 | Login with wrong password | Enter wrong password | Error message shown | | ⬜ |

## Dashboard Tests

| TC ID | Test Name | Steps | Expected Result | Actual Result | Status |
|-------|-----------|-------|-----------------|---------------|--------|
| TC-A05 | Dashboard loads correctly | Login as admin | Stats and charts visible | | ⬜ |
| TC-A06 | District wise collections shown | View dashboard | Each district total displayed | | ⬜ |
| TC-A07 | Fine category breakdown shown | View dashboard | Categories with amounts shown | | ⬜ |

## Fine Management Tests

| TC ID | Test Name | Steps | Expected Result | Actual Result | Status |
|-------|-----------|-------|-----------------|---------------|--------|
| TC-A08 | Issue a new fine | Fill fine form → Submit | Fine created, appears in list | | ⬜ |
| TC-A09 | Search fine by vehicle plate | Enter plate number → Search | Matching fines shown | | ⬜ |
| TC-A10 | View fine details | Click on a fine | Fine detail page opens | | ⬜ |
| TC-A11 | Change fine status to paid | Click mark as paid | Status updated successfully | | ⬜ |

## User Management Tests

| TC ID | Test Name | Steps | Expected Result | Actual Result | Status |
|-------|-----------|-------|-----------------|---------------|--------|
| TC-A12 | View all users | Go to users section | User list displayed | | ⬜ |
| TC-A13 | Delete a user | Click delete on a user | User removed from list | | ⬜ |
| TC-A14 | Access admin without login | Go to /admin directly | Redirect to login page | | ⬜ |

## Status Key
✅ Pass | ❌ Fail | ⬜ Not Tested Yet