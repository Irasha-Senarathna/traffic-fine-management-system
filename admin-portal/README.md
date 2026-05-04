# 🛡️ Admin Portal — React App

**Owner:** Kavi
**Branch:** `feature/admin-portal`
**Tech:** React 18, Axios, React Router, TailwindCSS (or Bootstrap)

This is the internal web app for traffic officers and administrators. Officers can issue fines, search vehicles, and manage user accounts. Admins can view reports and dashboards.

---

## 📁 Folder Structure

```
admin-portal/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx              # Left navigation sidebar
│   │   ├── Topbar.jsx               # Header bar with admin name
│   │   ├── FineTable.jsx            # Reusable table for fines list
│   │   ├── UserTable.jsx            # Reusable table for users list
│   │   └── StatCard.jsx             # Dashboard stats card (total fines, etc.)
│   ├── pages/
│   │   ├── LoginPage.jsx            # Admin login
│   │   ├── DashboardPage.jsx        # Overview stats and charts
│   │   ├── FinesListPage.jsx        # View all fines
│   │   ├── IssueFineForm.jsx        # Form to issue a new fine
│   │   ├── FineDetailPage.jsx       # View and edit a single fine
│   │   ├── UsersListPage.jsx        # Manage all users
│   │   └── UserDetailPage.jsx       # View/edit a single user
│   ├── services/
│   │   └── api.js                   # Axios instance + all API calls
│   ├── context/
│   │   └── AuthContext.jsx          # Admin JWT token & role state
│   ├── App.jsx                      # Routes setup
│   └── main.jsx                     # Entry point
├── .env                             # API base URL
├── package.json
└── README.md                        # This file
```

---

## ⚙️ Setup Instructions

### Step 1 — Install Dependencies

```bash
# Go into the admin-portal folder
cd admin-portal

# Install all packages
npm install
```

### Step 2 — Configure API URL

Create a `.env` file inside the `admin-portal/` folder:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Step 3 — Run the App

```bash
npm run dev
```

The app will open at: `http://localhost:5174`

> Note: If web-user is already running on 5173, Vite will auto-assign 5174 for this app.

---

## 📦 Dependencies to Install

```bash
npm install axios react-router-dom
npm install tailwindcss   # or: npm install bootstrap
```

---

## 🔌 Connecting to the Backend API

Create `src/services/api.js`:

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach JWT token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const adminLogin = (data) => API.post('/auth/login', data);

// Fines
export const getAllFines = () => API.get('/fines');
export const getFineById = (id) => API.get(`/fines/${id}`);
export const issueFine = (data) => API.post('/fines', data);
export const updateFine = (id, data) => API.put(`/fines/${id}`, data);
export const deleteFine = (id) => API.delete(`/fines/${id}`);
export const getFinesByVehicle = (plate) => API.get(`/fines/vehicle/${plate}`);

// Users
export const getAllUsers = () => API.get('/users');
export const getUserById = (id) => API.get(`/users/${id}`);
export const deleteUser = (id) => API.delete(`/users/${id}`);
```

---

## 🗺️ Page Routes

Set up in `App.jsx`:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/fines" element={<FinesListPage />} />
        <Route path="/fines/new" element={<IssueFineForm />} />
        <Route path="/fines/:id" element={<FineDetailPage />} />
        <Route path="/users" element={<UsersListPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 📱 Pages to Build

| Page | What It Does |
|------|-------------|
| Login | Officer/Admin login with email and password |
| Dashboard | Total fines count, total amount collected, recent fines table |
| Fines List | Searchable table of all fines with filter by status |
| Issue Fine Form | Form: vehicle plate, NIC, violation type, amount, date, location |
| Fine Detail | View all fine details; update status (paid/unpaid/disputed) |
| Users List | Table of all registered users with search |
| User Detail | View user info; option to deactivate/delete account |

---

## 📋 Issue Fine Form — Fields

When an officer issues a fine, the form should collect:

```
Vehicle Plate Number   (text input)
Driver NIC             (text input)
Violation Type         (dropdown: Speeding, Running Red Light, No Seatbelt, etc.)
Fine Amount (LKR)      (number input)
Date of Violation      (date picker — defaults to today)
Location               (text input)
Officer Notes          (textarea — optional)
```

---

## 🔒 Role-Based Access

The admin portal is only for officers and admins. After login, check the user's role from the JWT token response. If a normal user tries to log in here, redirect them away.

```javascript
// After login response:
if (response.data.role !== 'ADMIN' && response.data.role !== 'OFFICER') {
  alert('Access denied. Admin only.');
  return;
}
localStorage.setItem('adminToken', response.data.token);
navigate('/dashboard');
```

---

## ✅ Kavi's Task Checklist

- [ ] Initialize React project with Vite
- [ ] Set up React Router with all admin pages
- [ ] Build Login page with role check
- [ ] Build Dashboard with stat cards (total fines, collected amount)
- [ ] Build Fines List page with search and filter
- [ ] Build Issue Fine Form and connect to backend API
- [ ] Build Fine Detail page (view + update status)
- [ ] Build Users List page
- [ ] Build Sidebar navigation component
- [ ] Style with Tailwind or Bootstrap
- [ ] Handle loading states and API errors

---

## 🐛 Common Issues

**CORS error when calling the API:**
- Ask Ira to whitelist `http://localhost:5174` in the Spring Boot CORS config

**Role check not working:**
- Make sure Ira's API is returning the `role` field in the login response
- Check with Ira what the exact role string values are (e.g., `"ADMIN"`, `"OFFICER"`)

**Table shows empty even though data exists:**
- `console.log(response.data)` to see the exact structure of what the API returns
- The array might be nested inside a `data` or `content` field
