import 'package:flutter/material.dart';
import '../models/fine_model.dart';
import '../services/api_service.dart';
import '../utils/token_storage.dart';
import '../widgets/fine_card.dart';

class MyFinesScreen extends StatefulWidget {
  const MyFinesScreen({super.key});

  @override
  State<MyFinesScreen> createState() => _MyFinesScreenState();
}

class _MyFinesScreenState extends State<MyFinesScreen> {
  List<FineModel> _fines = [];
  List<FineModel> _filteredFines = [];
  bool _isLoading = true;
  String _filterStatus = 'ALL';
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadFines();
  }

  Future<void> _loadFines() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final userId = await TokenStorage.getUserId();
      if (userId == null) return;

      final results = await ApiService.getMyFines(userId);
      final fines = results.map((r) => FineModel.fromJson(r.data)).toList();
      setState(() {
        _fines = fines;
        _applyFilter();
      });
    } catch (e) {
      setState(() => _error = 'Failed to load fines. Pull down to retry.');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _applyFilter() {
    setState(() {
      if (_filterStatus == 'ALL') {
        _filteredFines = _fines;
      } else {
        _filteredFines =
            _fines.where((f) => f.status == _filterStatus).toList();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: const Text('My Fines'),
        backgroundColor: const Color(0xFF1565C0),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: Column(
        children: [
          // Filter chips
          Container(
            color: const Color(0xFF1565C0),
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            child: Row(
              children: ['ALL', 'UNPAID', 'PAID', 'DISPUTED'].map((status) {
                final isSelected = _filterStatus == status;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(status),
                    selected: isSelected,
                    onSelected: (_) {
                      setState(() => _filterStatus = status);
                      _applyFilter();
                    },
                    selectedColor: Colors.white,
                    labelStyle: TextStyle(
                      color: isSelected
                          ? const Color(0xFF1565C0)
                          : Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                    backgroundColor: Colors.white.withOpacity(0.2),
                    side: BorderSide.none,
                  ),
                );
              }).toList(),
            ),
          ),
          // Body
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _error != null
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.wifi_off,
                                size: 48, color: Colors.grey),
                            const SizedBox(height: 12),
                            Text(_error!,
                                style: const TextStyle(color: Colors.grey),
                                textAlign: TextAlign.center),
                          ],
                        ),
                      )
                    : _filteredFines.isEmpty
                        ? const Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.check_circle_outline,
                                    size: 64, color: Colors.green),
                                SizedBox(height: 12),
                                Text('No fines found!',
                                    style: TextStyle(
                                        fontSize: 18, color: Colors.grey)),
                              ],
                            ),
                          )
                        : RefreshIndicator(
                            onRefresh: _loadFines,
                            child: ListView.builder(
                              padding:
                                  const EdgeInsets.symmetric(vertical: 12),
                              itemCount: _filteredFines.length,
                              itemBuilder: (context, index) {
                                final fine = _filteredFines[index];
                                return FineCard(
                                  fine: fine,
                                  onTap: () => Navigator.pushNamed(
                                    context,
                                    '/fine-detail',
                                    arguments: fine,
                                  ).then((_) => _loadFines()),
                                );
                              },
                            ),
                          ),
          ),
        ],
      ),
    );
  }
}