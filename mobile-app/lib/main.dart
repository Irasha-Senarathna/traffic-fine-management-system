import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/my_fines_screen.dart';
import 'screens/fine_detail_screen.dart';
import 'screens/payment_success_screen.dart';

// NEW SCREENS
import 'screens/profile_screen.dart';
import 'screens/payment_history_screen.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Traffic Fine Manager',

      debugShowCheckedModeBanner: false,

      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF1565C0),
        ),
        useMaterial3: true,
        fontFamily: 'Roboto',
      ),

      // Start app
      initialRoute: '/',

      routes: {
        // AUTH FLOW
        '/': (context) => const SplashScreen(),
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),

        // MAIN APP
        '/dashboard': (context) => const DashboardScreen(),
        '/fines': (context) => const MyFinesScreen(),
        '/fine-detail': (context) => const FineDetailScreen(),
        '/payment-success': (context) => const PaymentSuccessScreen(),

        // NEW FEATURES
        '/profile': (context) => const ProfileScreen(),
        '/payment-history': (context) => const PaymentHistoryScreen(),
      },
    );
  }
}