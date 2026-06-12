import 'package:flutter/material.dart';

class PaymentHistoryScreen extends StatelessWidget {
  const PaymentHistoryScreen({super.key});

  // Dummy data (replace with API later)
  final List<Map<String, dynamic>> payments = const [
    {
      "fineId": "F001",
      "amount": 2500,
      "date": "2026-06-10",
      "status": "Paid"
    },
    {
      "fineId": "F002",
      "amount": 1500,
      "date": "2026-06-08",
      "status": "Paid"
    }
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Payment History")),
      body: ListView.builder(
        itemCount: payments.length,
        itemBuilder: (context, index) {
          final p = payments[index];

          return Card(
            child: ListTile(
              leading: const Icon(Icons.receipt_long),
              title: Text("Fine ID: ${p['fineId']}"),
              subtitle: Text("Date: ${p['date']}"),
              trailing: Text(
                "Rs. ${p['amount']}",
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          );
        },
      ),
    );
  }
}