import 'package:flutter/material.dart';
import '../models/fine_model.dart';

class FineCard extends StatelessWidget {
  final FineModel fine;
  final VoidCallback? onTap;

  const FineCard({super.key, required this.fine, this.onTap});

  Color get _statusColor {
    switch (fine.status) {
      case 'PAID':
        return Colors.green;
      case 'DISPUTED':
        return Colors.orange;
      default:
        return Colors.red;
    }
  }

  IconData get _statusIcon {
    switch (fine.status) {
      case 'PAID':
        return Icons.check_circle;
      case 'DISPUTED':
        return Icons.warning_amber;
      default:
        return Icons.error_outline;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    fine.fineNumber,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                      color: Color(0xFF1565C0),
                    ),
                  ),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: _statusColor.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      children: [
                        Icon(_statusIcon, size: 14, color: _statusColor),
                        const SizedBox(width: 4),
                        Text(
                          fine.status,
                          style: TextStyle(
                            color: _statusColor,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.directions_car,
                      size: 16, color: Colors.grey),
                  const SizedBox(width: 6),
                  Text(
                    fine.vehicleNumber,
                    style: const TextStyle(color: Colors.grey, fontSize: 13),
                  ),
                  const SizedBox(width: 16),
                  const Icon(Icons.calendar_today,
                      size: 14, color: Colors.grey),
                  const SizedBox(width: 6),
                  Text(
                    fine.issuedDate,
                    style: const TextStyle(color: Colors.grey, fontSize: 13),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    fine.offenceType,
                    style: const TextStyle(fontSize: 14),
                  ),
                  Text(
                    'LKR ${fine.amount.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: Color(0xFF1565C0),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}