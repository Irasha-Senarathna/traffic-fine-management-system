import 'package:flutter/material.dart';
import '../models/fine_model.dart';
import '../services/api_service.dart';
import '../widgets/custom_button.dart';

class FineDetailScreen extends StatefulWidget {
  const FineDetailScreen({super.key});

  @override
  State<FineDetailScreen> createState() => _FineDetailScreenState();
}

class _FineDetailScreenState extends State<FineDetailScreen> {
  bool _isPaying = false;

  Future<void> _payFine(FineModel fine) async {
    setState(() => _isPaying = true);
    try {
      final success = await ApiService.payFine(fine.id);
      if (!mounted) return;
      if (success) {
        Navigator.pushReplacementNamed(context, '/payment-success',
            arguments: fine);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
              content: Text('Payment failed. Try again.'),
              backgroundColor: Colors.red),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('Connection error. Try again.'),
            backgroundColor: Colors.red),
      );
    } finally {
      if (mounted) setState(() => _isPaying = false);
    }
  }

  Widget _detailRow(String label, String value, {Color? valueColor}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 130,
            child: Text(label,
                style: const TextStyle(color: Colors.grey, fontSize: 14)),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 14,
                color: valueColor ?? const Color(0xFF1A1A2E),
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final fine = ModalRoute.of(context)!.settings.arguments as FineModel;

    Color statusColor;
    switch (fine.status) {
      case 'PAID':
        statusColor = Colors.green;
        break;
      case 'DISPUTED':
        statusColor = Colors.orange;
        break;
      default:
        statusColor = Colors.red;
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: Text('Fine #${fine.fineNumber}'),
        backgroundColor: const Color(0xFF1565C0),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Status Banner
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: statusColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: statusColor.withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  Icon(
                    fine.isPaid
                        ? Icons.check_circle
                        : fine.isDisputed
                            ? Icons.warning_amber
                            : Icons.error_outline,
                    color: statusColor,
                    size: 32,
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(fine.status,
                          style: TextStyle(
                              color: statusColor,
                              fontWeight: FontWeight.bold,
                              fontSize: 18)),
                      Text(
                          fine.isPaid
                              ? 'This fine has been paid'
                              : 'Payment is required',
                          style: TextStyle(
                              color: statusColor.withOpacity(0.8),
                              fontSize: 13)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            // Details Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Fine Details',
                      style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: Color(0xFF1A1A2E))),
                  const Divider(height: 24),
                  _detailRow('Fine Number', fine.fineNumber),
                  _detailRow('Vehicle', fine.vehicleNumber),
                  _detailRow('Offence', fine.offenceType),
                  _detailRow('Issued Date', fine.issuedDate),
                  _detailRow(
                    'Amount',
                    'LKR ${fine.amount.toStringAsFixed(2)}',
                    valueColor: const Color(0xFF1565C0),
                  ),
                  if (fine.officerNotes != null &&
                      fine.officerNotes!.isNotEmpty)
                    _detailRow('Officer Notes', fine.officerNotes!),
                  if (fine.paidDate != null)
                    _detailRow('Paid On', fine.paidDate!,
                        valueColor: Colors.green),
                ],
              ),
            ),
            const SizedBox(height: 24),
            if (!fine.isPaid)
              CustomButton(
                text: 'Pay Now — LKR ${fine.amount.toStringAsFixed(2)}',
                onPressed: () => _payFine(fine),
                isLoading: _isPaying,
                color: Colors.green.shade700,
              ),
          ],
        ),
      ),
    );
  }
}