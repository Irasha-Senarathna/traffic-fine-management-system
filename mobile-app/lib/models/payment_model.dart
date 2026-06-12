class Payment {
  final String id;
  final String fineId;
  final double amount;
  final String date;
  final String status;

  Payment({
    required this.id,
    required this.fineId,
    required this.amount,
    required this.date,
    required this.status,
  });

  factory Payment.fromJson(Map<String, dynamic> json) {
    return Payment(
      id: json['id'],
      fineId: json['fineId'],
      amount: json['amount'].toDouble(),
      date: json['date'],
      status: json['status'],
    );
  }
}