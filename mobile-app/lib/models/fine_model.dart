class FineModel {
  final String id;
  final String fineNumber;
  final String vehicleNumber;
  final String offenceType;
  final double amount;
  final String status; // 'PAID', 'UNPAID', 'DISPUTED'
  final String issuedDate;
  final String? officerNotes;
  final String? paidDate;

  FineModel({
    required this.id,
    required this.fineNumber,
    required this.vehicleNumber,
    required this.offenceType,
    required this.amount,
    required this.status,
    required this.issuedDate,
    this.officerNotes,
    this.paidDate,
  });

  factory FineModel.fromJson(Map<String, dynamic> json) {
    return FineModel(
      id: json['id'].toString(),
      fineNumber: json['fineNumber'] ?? json['fine_number'] ?? '',
      vehicleNumber: json['vehicleNumber'] ?? json['vehicle_number'] ?? '',
      offenceType: json['offenceType'] ?? json['offence_type'] ?? '',
      amount: double.tryParse(json['amount'].toString()) ?? 0.0,
      status: json['status'] ?? 'UNPAID',
      issuedDate: json['issuedDate'] ?? json['issued_date'] ?? '',
      officerNotes: json['officerNotes'] ?? json['officer_notes'],
      paidDate: json['paidDate'] ?? json['paid_date'],
    );
  }

  bool get isPaid => status == 'PAID';
  bool get isDisputed => status == 'DISPUTED';
}