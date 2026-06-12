import 'package:flutter/material.dart';
import '../utils/token_storage.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String? userId;

  @override
  void initState() {
    super.initState();
    loadUser();
  }

  Future<void> loadUser() async {
    final id = await TokenStorage.getUserId();
    setState(() {
      userId = id;
    });
  }

  Future<void> logout() async {
    await TokenStorage.clearAll();
    if (!mounted) return;
    Navigator.pushNamedAndRemoveUntil(context, '/login', (route) => false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Profile")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Icon(Icons.person, size: 80),
            const SizedBox(height: 20),

            Text("User ID: ${userId ?? 'Loading...'}",
                style: const TextStyle(fontSize: 18)),

            const SizedBox(height: 30),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: logout,
                child: const Text("Logout"),
              ),
            )
          ],
        ),
      ),
    );
  }
}