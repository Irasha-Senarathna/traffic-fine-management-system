# 🧪 Test Plan — Traffic Fine Management System

**Prepared by:** Chamodi  
**Date:** June 2026  
**Version:** 1.0

---

## 1. Introduction

This document describes the testing strategy for the 
Traffic Fine Management System built for the Sri Lanka 
Police Department.

---

## 2. Scope of Testing

### What will be tested:
- ✅ Backend REST APIs
- ✅ Web User Portal (Niluminda)
- ✅ Admin Portal (Kavi)
- ✅ Mobile App (Osh)
- ✅ SMS Notification Feature (Chamodi)
- ✅ JWT Authentication

### What will NOT be tested:
- ❌ Database internal operations
- ❌ Third party payment gateway internals
- ❌ Twilio internal SMS delivery

---

## 3. Types of Testing

### 3.1 Manual Testing
- Tester manually uses the app
- Follows test cases in testing/ folder
- Reports bugs as GitHub Issues

### 3.2 API Testing (Postman)
- Test all backend endpoints
- Verify correct status codes
- Verify correct response data

### 3.3 Automated Testing (Selenium)
- Automated browser tests
- Login flow
- Fine payment flow
- Admin portal access control

---

## 4. Test Environment

| Component | Details |
|-----------|---------|
| OS | Windows 11 |
| Browser | Chrome (latest) |
| Backend URL | http://localhost:8080 |
| Web Portal URL | http://localhost:3000 |
| Admin Portal URL | http://localhost:3001 |
| Mobile | Android Emulator |
| Database | MySQL 8.0 |

---

## 5. Testing Schedule

| Phase | What | When |
|-------|------|------|
| Phase 1 | Write all test cases | Week 1 |
| Phase 2 | API testing with Postman | Week 2 |
| Phase 3 | Web portal testing | Week 2-3 |
| Phase 4 | Admin portal testing | Week 2-3 |
| Phase 5 | Mobile app testing | Week 3 |
| Phase 6 | Full end to end testing | Final week |

---

## 6. Bug Severity Levels

| Level | Meaning | Example |
|-------|---------|---------|
| 🔴 High | App crashes or data lost | Payment fails silently |
| 🟡 Medium | Feature broken but workaround exists | Filter not working |
| 🟢 Low | Minor UI issue | Button color wrong |

---

## 7. Bug Reporting Process

1. Find a bug during testing
2. Take a screenshot
3. Create GitHub Issue with format:
   - Title: `[BUG] Short description`
   - Steps to reproduce
   - Expected vs actual result
   - Severity level
   - Assign to responsible member

---

## 8. Test Completion Criteria

Testing is complete when:
- ✅ All test cases executed
- ✅ All High severity bugs fixed
- ✅ All Medium severity bugs fixed or documented
- ✅ SMS notification working end to end
- ✅ JWT authentication working on all portals

---

## 9. Test Case Files

| File | Description |
|------|-------------|
| backend-test-cases.md | API endpoint tests |
| web-user-test-cases.md | Web portal tests |
| admin-portal-test-cases.md | Admin portal tests |
| mobile-test-cases.md | Mobile app tests |

---

## 10. Tools Used

| Tool | Purpose |
|------|---------|
| Postman | API testing |
| Chrome DevTools | Frontend debugging |
| Selenium | Automated browser testing |
| Android Studio | Mobile app testing |
| GitHub Issues | Bug tracking |