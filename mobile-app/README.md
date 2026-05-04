# 📱 Mobile App — Flutter

**Owner:** Osh
**Branch:** `feature/mobile-app`
**Tech:** Flutter 3.x, Dart, HTTP package, SharedPreferences

This is the mobile version of the public user app. Citizens can log in, view their traffic fines, and pay them from their phone.

---

## 📁 Folder Structure

```
mobile-app/
├── android/                          # Android native files (auto-generated)
├── ios/                              # iOS native files (auto-generated)
├── lib/
│   ├── main.dart                     # App entry point
│   ├── screens/
│   │   ├── splash_screen.dart        # Loading screen on app open
│   │   ├── login_screen.dart         # Login form
│   │   ├── register_screen.dart      # Registration form
│   │   ├── dashboard_screen.dart     # Home dashboard after login
│   │   ├── my_fines_screen.dart      # List of user's fines
│   │   ├── fine_detail_screen.dart   # Single fine detail + pay button
│   │   └── payment_success_screen.dart  # Confirmation after payment
│   ├── models/
│   │   ├── fine_model.dart           # Fine data model
│   │   └── user_model.dart           # User data model
│   ├── services/
│   │   └── api_service.dart          # All HTTP calls to backend
│   ├── utils/
│   │   └── token_storage.dart        # Save/load JWT with SharedPreferences
│   └── widgets/
│       ├── fine_card.dart            # Reusable card widget for a fine
│       └── custom_button.dart        # Reusable styled button
├── pubspec.yaml                      # Flutter dependencies
└── README.md                         # This file
```

---

## ⚙️ Setup Instructions

### Step 1 — Install Flutter

If you haven't installed Flutter yet:
1. Download from: https://flutter.dev/docs/get-started/install
2. Run `flutter doctor` to check everything is set up

### Step 2 — Install Dependencies

```bash
# Go into the mobile-app folder
cd mobile-app

# Get all packages
flutter pub get
```

### Step 3 — Configure the API URL

Open `lib/services/api_service.dart` and set the base URL:

```dart
const String baseUrl = 'http://10.0.2.2:8080/api';
// Use 10.0.2.2 (not localhost) when running on Android Emulator
// For a real phone on the same WiFi: use your computer's local IP e.g. http://192.168.1.x:8080/api
```

### Step 4 — Run the App

```bash
# List available devices
flutter devices

# Run on Android emulator or connected phone
flutter run
```

---

## 📦 pubspec.yaml — Dependencies

Add these under `dependencies:` in `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0                   # For API calls
  shared_preferences: ^2.2.0     # To save JWT token on device
  provider: ^6.1.0               # State management (optional but recommended)
```

After editing `pubspec.yaml`, always run:
```bash
flutter pub get
```

---

## 🔌 Connecting to the Backend API

Create `lib/services/api_service.dart`:

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/token_storage.dart';

const String baseUrl = 'http://10.0.2.2:8080/api';

class ApiService {
  // Get token from storage and build auth headers
  static Future<Map<String, String>> _authHeaders() async {
    final token = await TokenStorage.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  // Login
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    return jsonDecode(response.body);
  }

  // Register
  static Future<Map<String, dynamic>> register(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(data),
    );
    return jsonDecode(response.body);
  }

  // Get fines for logged-in user
  static Future<List<dynamic>> getMyFines(String userId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/fines/user/$userId'),
      headers: await _authHeaders(),
    );
    return jsonDecode(response.body);
  }

  // Pay a fine
  static Future<bool> payFine(String fineId) async {
    final response = await http.put(
      Uri.parse('$baseUrl/fines/$fineId/pay'),
      headers: await _authHeaders(),
    );
    return response.statusCode == 200;
  }
}
```

---

## 💾 Saving the JWT Token (SharedPreferences)

Create `lib/utils/token_storage.dart`:

```dart
import 'package:shared_preferences/shared_preferences.dart';

class TokenStorage {
  static const _tokenKey = 'jwt_token';
  static const _userIdKey = 'user_id';

  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  static Future<void> saveUserId(String userId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userIdKey, userId);
  }

  static Future<String?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userIdKey);
  }

  static Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}
```

---

## 📱 Screens to Build

| Screen | What It Shows |
|--------|--------------|
| Splash Screen | App logo, auto-navigate to login or dashboard |
| Login | Email + password fields, login button |
| Register | Name, NIC, email, phone, password |
| Dashboard | Greeting, unpaid fines count, quick action buttons |
| My Fines | Scrollable list of fines (fine number, date, amount, status color) |
| Fine Detail | Full fine info, officer notes, "Pay Now" button |
| Payment Success | Green check icon, receipt summary, back to home button |

---

## 🗺️ Navigation Setup (main.dart)

```dart
import 'package:flutter/material.dart';
import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/my_fines_screen.dart';
import 'screens/fine_detail_screen.dart';
import 'screens/payment_success_screen.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Traffic Fine Manager',
      theme: ThemeData(primarySwatch: Colors.blue),
      initialRoute: '/',
      routes: {
        '/': (context) => const SplashScreen(),
        '/login': (context) => const LoginScreen(),
        '/dashboard': (context) => const DashboardScreen(),
        '/fines': (context) => const MyFinesScreen(),
        '/payment-success': (context) => const PaymentSuccessScreen(),
      },
    );
  }
}
```

---

## ✅ Osh's Task Checklist

- [ ] Confirm Flutter is installed (`flutter doctor` passes)
- [ ] Set up project structure and `pubspec.yaml`
- [ ] Create `ApiService` and `TokenStorage` classes
- [ ] Build Splash Screen (auto-redirect based on token)
- [ ] Build Login screen and connect to API
- [ ] Build Register screen and connect to API
- [ ] Build Dashboard screen (fetch and display fine count)
- [ ] Build My Fines screen with fine list
- [ ] Build Fine Detail screen with Pay button
- [ ] Build Payment Success screen
- [ ] Test on Android emulator
- [ ] Test on real device (update base URL to LAN IP)

---

## 🐛 Common Issues

**Cannot connect to backend (Connection refused):**
- Use `10.0.2.2:8080` for Android emulator, NOT `localhost`
- For real device: find your PC's local IP with `ipconfig` (Windows) or `ifconfig` (Mac/Linux) and use that IP

**`flutter pub get` fails:**
- Check your internet connection
- Try `flutter clean` then `flutter pub get` again

**App crashes on startup:**
- Run `flutter run` in the terminal to see the full error message
- Check that all imports in `main.dart` match your actual file names
