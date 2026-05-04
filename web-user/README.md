# 🌐 Web User Frontend — React App

**Owner:** Niluminda
**Branch:** `feature/web-user-frontend`
**Tech:** React 18, Axios, React Router, TailwindCSS (or Bootstrap)

This is the public-facing web app where registered citizens can log in, view their traffic fines, and pay them online.

---

## 📁 Folder Structure

```
web-user/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx               # Top navigation bar
│   │   ├── Footer.jsx               # Page footer
│   │   └── FineCard.jsx             # Card to display a single fine
│   ├── pages/
│   │   ├── LandingPage.jsx          # Home / welcome page
│   │   ├── LoginPage.jsx            # Login form
│   │   ├── RegisterPage.jsx         # Registration form
│   │   ├── DashboardPage.jsx        # User dashboard after login
│   │   ├── MyFinesPage.jsx          # View list of user's fines
│   │   ├── FineDetailPage.jsx       # Single fine details + pay button
│   │   └── PaymentSuccessPage.jsx   # Confirmation after payment
│   ├── services/
│   │   └── api.js                   # Axios instance + all API calls
│   ├── context/
│   │   └── AuthContext.jsx          # JWT token storage & user state
│   ├── App.jsx                      # Routes setup
│   └── main.jsx                     # React entry point
├── .env                             # API base URL (do not commit secrets)
├── package.json
└── README.md                        # This file
```

---

## ⚙️ Setup Instructions

### Step 1 — Install Dependencies

```bash
# Go into the web-user folder
cd web-user

# Install all packages
npm install
```

### Step 2 — Configure API URL

Create a `.env` file inside the `web-user/` folder:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

> ⚠️ Make sure Ira has the backend running on port 8080 before starting the frontend.

### Step 3 — Run the App

```bash
npm run dev
```

The app will open at: `http://localhost:5173`

---

## 📦 Dependencies to Install

```bash
npm install axios react-router-dom
npm install tailwindcss   # or: npm install bootstrap
```

Add these to your `package.json` or install them one by one.

---

## 🔌 Connecting to the Backend API

All API calls should go through a single file: `src/services/api.js`

```javascript
// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);

// Fines
export const getMyFines = (userId) => API.get(`/fines/user/${userId}`);
export const getFineById = (fineId) => API.get(`/fines/${fineId}`);

// Payments
export const payFine = (fineId) => API.put(`/fines/${fineId}/pay`);
```

---

## 🔐 Handling Login (JWT Token)

After a successful login response, save the token to localStorage:

```javascript
// In LoginPage.jsx
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await loginUser({ email, password });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userId', response.data.userId);
    navigate('/dashboard');
  } catch (error) {
    setError('Invalid email or password');
  }
};
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
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/fines" element={<MyFinesPage />} />
        <Route path="/fines/:id" element={<FineDetailPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 📱 Pages to Build

| Page | What It Shows |
|------|--------------|
| Landing Page | Welcome message, login / register buttons |
| Login | Email + password form |
| Register | Name, email, password, NIC, phone number |
| Dashboard | Welcome message, fine count summary, quick links |
| My Fines | Table of all fines (fine number, date, amount, status) |
| Fine Detail | Full details of one fine + "Pay Now" button |
| Payment Success | Confirmation message after paying |

---

## ✅ Niluminda's Task Checklist

- [ ] Initialize React project with Vite (`npm create vite@latest`)
- [ ] Set up React Router with all pages
- [ ] Build the Login and Register pages
- [ ] Connect login to backend API and save JWT token
- [ ] Build Dashboard page (show fine count, user info)
- [ ] Build My Fines page (fetch and display fines)
- [ ] Build Fine Detail page (show one fine, add Pay button)
- [ ] Connect Pay button to backend payment API
- [ ] Build Payment Success confirmation page
- [ ] Add Navbar and Footer components
- [ ] Basic styling (Tailwind or Bootstrap)
- [ ] Handle loading states and error messages

---

## 🐛 Common Issues

**API call fails with CORS error:**
- Tell Ira to add CORS config in the Spring Boot backend
- Ira needs to allow `http://localhost:5173` in the backend CORS settings

**Token not being sent:**
- Check that `localStorage.getItem('token')` is not returning null
- Make sure you saved the token after login

**Page not found after refresh:**
- This is a React Router issue in development — it's normal, don't worry about it yet
