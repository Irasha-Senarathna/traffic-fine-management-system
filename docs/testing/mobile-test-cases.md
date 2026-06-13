# Mobile App Test Cases

**Tester:** Chamodi  
**Tool:** Android Emulator (Android Studio)  
**Platform:** Android

---

## App Launch Tests

| TC ID | Test Name | Steps | Expected Result | Actual Result | Status |
|-------|-----------|-------|-----------------|---------------|--------|
| TC-M01 | App opens correctly | Launch app on Chrome | Splash screen then login page | Login page opened successfully | ✅ |
|| TC-M02 | App opens without internet | Turn off wifi → Launch app | Friendly "No connection" message | Friendly "No internet connection" message displayed | ✅ |

## Login Tests

| TC ID | Test Name | Steps | Expected Result | Actual Result | Status |
|-------|-----------|-------|-----------------|---------------|--------|
| TC-M03 | Login with correct credentials | Enter correct email + password | Navigate to dashboard | Successfully logged in | ✅ |
|| TC-M04 | Login with wrong password | Enter wrong password | Error message shown | Login failed message displayed | ✅ |
| TC-M05 | Login with empty fields | Tap login without filling | Validation errors shown | "Please fill in all fields" message displayed | ✅ |

## Fine Payment Tests

| TC ID | Test Name | Steps | Expected Result | Actual Result | Status |
|-------|-----------|-------|-----------------|---------------|--------|
| TC-M06 | Enter valid fine reference | Type valid reference → Search | Fine details displayed | | ⬜ |
| TC-M07 | Enter invalid fine reference | Type fake reference → Search | "Fine not found" error | | ⬜ |
| TC-M08 | Complete payment on mobile | Fill payment details → Pay | Success screen + SMS sent | | ⬜ |
| TC-M09 | Pay already paid fine | Try paying same fine twice | "Already paid" error shown | | ⬜ |

## UI & Navigation Tests

| TC ID | Test Name | Steps | Expected Result | Actual Result | Status |
|-------|-----------|-------|-----------------|---------------|--------|
| TC-M10 | Navigate between screens | Tap all menu items | Each screen loads correctly | | ⬜ |
| TC-M11 | Back button works | Press back button | Goes to previous screen | | ⬜ |
| TC-M12 | Logout from app | Tap logout | Token cleared, back to login | | ⬜ |
| TC-M13 | Screen fits properly | Check all screens | No overflow or cut off text | | ⬜ |

## Status Key
✅ Pass | ❌ Fail | ⬜ Not Tested Yet