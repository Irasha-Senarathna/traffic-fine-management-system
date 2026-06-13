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
    private final SmsService smsService;

    @SuppressWarnings("null")
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

        Payment saved = paymentRepository.save(payment);

        try {
            String officerPhone = fine.getUser() != null ? fine.getUser().getPhone() : null;
            smsService.sendPaymentConfirmation(officerPhone, fine.getVehiclePlate(), fine.getId());
        } catch (Exception ignored) {
            // SMS failure must never roll back a successful payment
        }

        return saved;
    }

    public Payment getPaymentByFine(Long fineId) {
        return paymentRepository.findByFineId(fineId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
}