package com.traffic.backend.controller;

import com.traffic.backend.dto.PaymentDTO;
import com.traffic.backend.model.Payment;
import com.traffic.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Payment> processPayment(
            @RequestBody PaymentDTO dto) {
        return ResponseEntity.ok(paymentService.processPayment(dto));
    }

    @GetMapping("/{fineId}")
    public ResponseEntity<Payment> getPaymentByFine(
            @PathVariable Long fineId) {
        return ResponseEntity.ok(paymentService.getPaymentByFine(fineId));
    }
}