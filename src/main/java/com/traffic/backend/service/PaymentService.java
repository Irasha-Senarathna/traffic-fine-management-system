package com.traffic.backend.service;

import com.traffic.backend.dto.PaymentDTO;
import com.traffic.backend.model.Fine;
import com.traffic.backend.model.Payment;
import com.traffic.backend.repository.FineRepository;
import com.traffic.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final FineRepository fineRepository;

    public Payment processPayment(PaymentDTO dto) {
        Fine fine = fineRepository.findById(dto.getFineId())
                .orElseThrow(() -> new RuntimeException("Fine not found"));

        if (fine.getStatus().equals("PAID")) {
            throw new RuntimeException("Fine is already paid");
        }

        Payment payment = new Payment();
        payment.setAmount(dto.getAmount());
        payment.setPaidAt(LocalDateTime.now());
        payment.setFine(fine);

        fine.setStatus("PAID");
        fineRepository.save(fine);

        return paymentRepository.save(payment);
    }

    public Payment getPaymentByFine(Long fineId) {
        return paymentRepository.findByFineId(fineId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
}