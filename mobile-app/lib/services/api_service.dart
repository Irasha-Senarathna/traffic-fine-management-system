import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/token_storage.dart';
import '../utils/constants.dart';

class ApiService {
  // ---------------------------
  // HEADERS WITH TOKEN
  // ---------------------------
  static Future<Map<String, String>> _headers() async {
    final token = await TokenStorage.getToken();

    return {
      "Content-Type": "application/json",
      if (token != null) "Authorization": "Bearer $token",
    };
  }

  // ---------------------------
  // LOGIN
  // ---------------------------
  static Future<Map<String, dynamic>> login(
      String email, String password) async {
    final response = await http.post(
      Uri.parse("${AppConstants.baseUrl}/auth/login"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "email": email,
        "password": password,
      }),
    );

    final data = jsonDecode(response.body);

    if (response.statusCode == 200) {
      await TokenStorage.saveToken(data["token"]);
      await TokenStorage.saveUserId(data["userId"].toString());
    }

    return data;
  }

  // ---------------------------
  // REGISTER
  // ---------------------------
  static Future<Map<String, dynamic>> register(
      Map<String, dynamic> user) async {
    final response = await http.post(
      Uri.parse("${AppConstants.baseUrl}/auth/register"),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(user),
    );

    return jsonDecode(response.body);
  }

  // ---------------------------
  // GET MY FINES
  // ---------------------------
  static Future<List<dynamic>> getMyFines(String userId) async {
    final response = await http.get(
      Uri.parse("${AppConstants.baseUrl}/fines/user/$userId"),
      headers: await _headers(),
    );

    return jsonDecode(response.body);
  }

  // ---------------------------
  // GET FINE BY ID
  // ---------------------------
  static Future<Map<String, dynamic>> getFineById(String id) async {
    final response = await http.get(
      Uri.parse("${AppConstants.baseUrl}/fines/$id"),
      headers: await _headers(),
    );

    return jsonDecode(response.body);
  }

  // ---------------------------
  // PAY FINE
  // ---------------------------
  static Future<bool> payFine(String fineId) async {
    final response = await http.put(
      Uri.parse("${AppConstants.baseUrl}/fines/$fineId/pay"),
      headers: await _headers(),
    );

    return response.statusCode == 200;
  }

  // ---------------------------
  // GET PAYMENT HISTORY
  // ---------------------------
  static Future<List<dynamic>> getPayments(String userId) async {
    final response = await http.get(
      Uri.parse("${AppConstants.baseUrl}/payments/$userId"),
      headers: await _headers(),
    );

    return jsonDecode(response.body);
  }
}