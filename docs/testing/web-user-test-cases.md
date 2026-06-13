# Web User Portal Test Cases

**Tester:** Chamodi  
**Tool:** Browser (Chrome)  
**URL:** http://localhost:3000

---

## Registration & Login Tests

| TC ID | Test Name | Steps | Expected Result | Actual Result | Status |
|-------|-----------|-------|-----------------|---------------|--------|
|| TC-W01 | Open landing page | Go to http://localhost:3000 | Page loads correctly | Page loads correctly | ✅ |
| TC-W02 | Register new user | Fill all fields correctly → Submit | Redirect to login, success message | Redirected to login with success message | ✅ |
| TC-W03 | Register with duplicate email | Use already registered email | Error message shown | Error message displayed | ✅ |
| TC-W04 | Register with empty fields | Leave fields empty → Submit | Validation errors shown | Validation errors displayed | ✅ |
| TC-W05 | Login with correct credentials | Enter correct email + password | Redirect to dashboard | Redirected to dashboard | ✅ |
| TC-W06 | Login with wrong password | Enter wrong password | Error message shown | Error message displayed | ✅ |
| TC-W07 | Login with empty fields | Click login without filling | Validation errors shown | Validation errors shown | ✅ |

## Fine Payment Tests

| TC ID | Test Name | Steps | Expected Result | Actual Result | Status |
|-------|-----------|-------|-----------------|---------------|--------|
| TC-W08 | Enter valid fine reference | Type valid reference → Search | Fine details displayed | | ⬜ |
| TC-W08 | Enter valid fine reference | Type valid reference → Search | Fine details displayed | Fine details displayed correctly | ✅ |
| TC-W09 | Enter invalid fine reference | Type fake reference → Search | "Fine not found" error | Error message shown | ✅ |
| TC-W10 | Leave reference empty | Click search with empty field | Validation error shown | Validation error displayed | ✅ |
| TC-W11 | Complete full payment | Fill all payment details → Pay | Confirmation shown + SMS sent | Payment confirmed successfully | ✅ |
| TC-W12 | Pay already paid fine | Try paying same fine twice | "Already paid" error shown | Already paid error displayed | ✅ |
| TC-W13 | Enter invalid card details | Wrong card number → Pay | Payment error shown | Payment error displayed | ✅ |

## General UI Tests

| TC ID | Test Name | Steps | Expected Result | Actual Result | Status |
|-------|-----------|-------|-----------------|---------------|--------|
| TC-W14 | Logout | Click logout button | Token cleared, redirect to login | Redirected to login page | ✅ |
| TC-W15 | Access dashboard without login | Go to /dashboard directly | Redirect to login page | Redirected to login | ✅ |
| TC-W16 | Check on mobile screen | Shrink browser to mobile size | Layout adjusts correctly | Layout responsive | ✅ |

## Status Key
✅ Pass | ❌ Fail | ⬜ Not Tested Yet