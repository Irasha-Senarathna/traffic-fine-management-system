import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/token_storage.dart';

// ⚠️ CHANGE THIS when testing on real device or when backend is deployed
// Android Emulator: http://10.0.2.2:8080/api
// Real device on same WiFi: http://192.168.x.x:8080/api (your PC's local IP)
const String baseUrl = 'http://10.0.2.2:8080/api';

class ApiService {
  static Future<Map<String, String>> _authHeaders() async {
    final token = await TokenStorage.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  // ─── AUTH ────────────────────────────────────────────
  static Future<Map<String, dynamic>> login(
      String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> register(
      Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(data),
    );
    return jsonDecode(response.body);
  }

  // ─── FINES ───────────────────────────────────────────
  static Future<List<FineResult>> getMyFines(String userId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/fines/user/$userId'),
      headers: await _authHeaders(),
    );
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => FineResult.success(json)).toList();
    }
    return [];
  }

  static Future<bool> payFine(String fineId) async {
    final response = await http.put(
      Uri.parse('$baseUrl/fines/$fineId/pay'),
      headers: await _authHeaders(),
    );
    return response.statusCode == 200;
  }
}

class FineResult {
  final Map<String, dynamic> data;
  FineResult.success(this.data);
}