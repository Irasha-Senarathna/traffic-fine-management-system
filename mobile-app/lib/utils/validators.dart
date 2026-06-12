class Validators {
  static String? validateEmail(String value) {
    if (!value.contains("@")) {
      return "Enter a valid email";
    }
    return null;
  }

  static String? validatePassword(String value) {
    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }
    return null;
  }

  static String? validateNIC(String value) {
    if (value.isEmpty) {
      return "NIC is required";
    }
    return null;
  }

  static String? validatePhone(String value) {
    if (value.length < 10) {
      return "Enter valid phone number";
    }
    return null;
  }
}