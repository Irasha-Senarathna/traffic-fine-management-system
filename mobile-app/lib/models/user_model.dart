class UserModel {
  final String id;
  final String name;
  final String email;
  final String nic;
  final String phone;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.nic,
    required this.phone,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'].toString(),
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      nic: json['nic'] ?? '',
      phone: json['phone'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'nic': nic,
      'phone': phone,
    };
  }
}