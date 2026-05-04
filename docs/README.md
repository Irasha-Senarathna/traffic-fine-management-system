# 📚 Documentation & QA Testing

**Owner:** Chamo
**Branch:** `feature/docs`
**Responsibility:** Project documentation, test plans, and quality assurance

This folder contains all project documentation, the database schema, API references, test cases, and meeting notes for the Traffic Fine Management System.

---

## 📁 Folder Structure

```
docs/
├── database/
│   └── schema.sql                    # MySQL database schema (maintained by Dimuthu)
├── api/
│   └── api-reference.md             # Full API endpoint documentation
├── testing/
│   ├── test-plan.md                 # Overall testing strategy
│   ├── backend-test-cases.md        # Test cases for API endpoints
│   ├── web-user-test-cases.md       # Test cases for web user app
│   ├── admin-portal-test-cases.md   # Test cases for admin portal
│   └── mobile-test-cases.md        # Test cases for mobile app
├── setup/
│   └── environment-setup.md         # How to set up dev environment
├── meetings/
│   └── meeting-notes.md             # Group meeting notes and decisions
└── README.md                        # This file
```

---

## 📋 Chamo's Responsibilities

### 1. Documentation
Write and maintain clear documentation so every team member understands the project.

### 2. QA Testing
Create test cases, manually test all features, and report bugs as GitHub Issues.

### 3. Meeting Notes
Keep a record of what the team decides in each meeting.

---

## 📝 How to Write Good Documentation

Every doc file should have:
- A clear title and purpose at the top
- Who it's for (users? developers? officers?)
- Step-by-step instructions where needed
- Screenshots if possible (paste images directly into GitHub markdown)

---

## 🧪 Test Case Format

Use this format for every test case in your test case files:

```
Test ID:       TC-001
Module:        Login (Web User)
Test Name:     Successful login with valid credentials
Precondition:  User is registered in the system
Steps:
  1. Go to http://localhost:5173/login
  2. Enter a registered email and correct password
  3. Click "Login" button
Expected:      Redirect to Dashboard page. JWT token saved in localStorage.
Actual:        (fill in after testing)
Status:        Pass / Fail
Tester:        Chamo
Date:          DD/MM/YYYY
```

---

## 🗂️ Test Cases to Write

### Backend / API Tests
Test these manually using **Postman** or the Swagger UI at `http://localhost:8080/swagger-ui.html`:

| TC ID | Test | Expected Result |
|-------|------|----------------|
| TC-B01 | Register with valid details | 201 Created, user saved in DB |
| TC-B02 | Register with duplicate email | 400 Bad Request, error message |
| TC-B03 | Login with correct credentials | 200 OK, JWT token returned |
| TC-B04 | Login with wrong password | 401 Unauthorized |
| TC-B05 | Issue a fine (officer logged in) | 201 Created, fine saved |
| TC-B06 | Issue a fine without auth token | 403 Forbidden |
| TC-B07 | Get fines for a user | 200 OK, list of fines returned |
| TC-B08 | Pay a fine (valid fine ID) | 200 OK, status updated to PAID |
| TC-B09 | Pay a fine that's already paid | 400 Bad Request or error message |
| TC-B10 | Delete a user (admin only) | 200 OK, user removed from DB |

### Web User App Tests

| TC ID | Test | Expected Result |
|-------|------|----------------|
| TC-W01 | Open landing page | Page loads correctly, no errors |
| TC-W02 | Register new user | Redirect to login page, success message |
| TC-W03 | Login with correct credentials | Redirect to dashboard |
| TC-W04 | Login with wrong password | Error message shown |
| TC-W05 | View my fines (after login) | List of fines displayed correctly |
| TC-W06 | Click on a fine | Fine detail page opens |
| TC-W07 | Click "Pay Now" on unpaid fine | Payment processed, status changes |
| TC-W08 | Log out | Token cleared, redirect to login |

### Admin Portal Tests

| TC ID | Test | Expected Result |
|-------|------|----------------|
| TC-A01 | Admin login | Redirected to dashboard |
| TC-A02 | Normal user tries to login to admin | Access denied message |
| TC-A03 | Dashboard loads with stats | Correct totals shown |
| TC-A04 | Issue a new fine (fill form) | Fine created, appears in fines list |
| TC-A05 | Search fines by vehicle plate | Matching fines shown |
| TC-A06 | Change fine status to Paid | Status updated successfully |
| TC-A07 | Delete a user | User removed from list |

### Mobile App Tests

| TC ID | Test | Expected Result |
|-------|------|----------------|
| TC-M01 | App opens on Android emulator | Splash screen shows, then login |
| TC-M02 | Login with correct credentials | Navigate to dashboard |
| TC-M03 | View fines list | Fine cards appear correctly |
| TC-M04 | Tap a fine | Detail screen opens |
| TC-M05 | Pay a fine | Success screen appears |
| TC-M06 | No internet connection | Friendly error message shown |

---

## 🐛 How to Report a Bug (GitHub Issues)

When you find a bug during testing:

1. Go to the GitHub repo → **Issues** tab
2. Click **New Issue**
3. Use this format for the title: `[BUG] Short description of the bug`
4. In the description, include:
   - **Module:** (Backend / Web User / Admin / Mobile)
   - **Steps to reproduce:** numbered list
   - **Expected:** what should happen
   - **Actual:** what actually happened
   - **Severity:** Low / Medium / High
5. Assign the issue to the responsible team member

---

## 📅 Meeting Notes Template

Add a new entry to `docs/meetings/meeting-notes.md` after each group meeting:

```markdown
## Meeting — DD/MM/YYYY

**Attendees:** Ira, Niluminda, Kavi, Osh, Chamo, Dimuthu

### Topics Discussed
1. ...
2. ...

### Decisions Made
- ...

### Action Items
| Task | Assigned To | Due Date |
|------|------------|----------|
| ... | ... | ... |

### Next Meeting
Date: ...
```

---

## ✅ Chamo's Task Checklist

- [ ] Create `docs/` folder structure
- [ ] Write backend test cases in `testing/backend-test-cases.md`
- [ ] Write web user test cases in `testing/web-user-test-cases.md`
- [ ] Write admin portal test cases in `testing/admin-portal-test-cases.md`
- [ ] Write mobile test cases in `testing/mobile-test-cases.md`
- [ ] Install Postman and test all backend APIs
- [ ] Write `setup/environment-setup.md` (how to set up for new dev)
- [ ] Create first meeting notes entry
- [ ] Report any bugs found as GitHub Issues
- [ ] Help write the final project report (if required)

---

## 📥 Tools You Will Need

- **Postman** — for testing APIs: https://www.postman.com/downloads/
  - Import the collection from Ira once backend is ready
- **Browser DevTools** — for testing web apps (F12 → Network tab)
- **Android Emulator** (via Android Studio) — for testing mobile app
- A text editor like **VS Code** for editing markdown files

---

## 💡 Tips for Good Testing

- Test the happy path first (everything works correctly)
- Then test edge cases (empty fields, wrong formats, very long text)
- Always test what happens when the internet/backend is down
- Re-test after every Pull Request is merged into `main`
