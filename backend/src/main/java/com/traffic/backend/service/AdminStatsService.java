package com.traffic.backend.service;

import com.traffic.backend.repository.FineRepository;
import com.traffic.backend.repository.PaymentRepository;
import com.traffic.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final FineRepository fineRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    public Map<String, Object> getSummary() {
        long totalFines = fineRepository.count();
        long paidFines = fineRepository.countByStatus("PAID");
        long unpaidFines = fineRepository.countByStatus("UNPAID");
        Double totalCollected = fineRepository.sumAmountByStatus("PAID");
        long totalUsers = userRepository.count();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalFines", totalFines);
        result.put("paidFines", paidFines);
        result.put("unpaidFines", unpaidFines);
        result.put("totalCollected", totalCollected != null ? totalCollected : 0.0);
        result.put("totalUsers", totalUsers);
        return result;
    }

    public Map<String, Object> getByDistrict() {
        List<Object[]> rows = fineRepository.sumAmountGroupByDistrict();
        Map<String, Object> result = new LinkedHashMap<>();
        List<Map<String, Object>> data = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("district", row[0] != null ? row[0].toString() : "Unknown");
            entry.put("total", row[1] != null ? ((Number) row[1]).doubleValue() : 0.0);
            entry.put("count", row[2] != null ? ((Number) row[2]).longValue() : 0L);
            data.add(entry);
        }
        result.put("districts", data);
        return result;
    }

    public Map<String, Object> getByCategory() {
        List<Object[]> rows = fineRepository.sumAmountGroupByCategory();
        Map<String, Object> result = new LinkedHashMap<>();
        List<Map<String, Object>> data = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("category", row[0] != null ? row[0].toString() : "Unknown");
            entry.put("total", row[1] != null ? ((Number) row[1]).doubleValue() : 0.0);
            entry.put("count", row[2] != null ? ((Number) row[2]).longValue() : 0L);
            data.add(entry);
        }
        result.put("categories", data);
        return result;
    }
}
