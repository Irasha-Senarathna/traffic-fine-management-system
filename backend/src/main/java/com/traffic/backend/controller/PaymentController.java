package com.traffic.backend.controller;

import com.stripe.model.checkout.Session;
import com.traffic.backend.dto.PaymentDTO;
import com.traffic.backend.model.Payment;
import com.traffic.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

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

    @PostMapping("/checkout-session/{fineId}")
    public ResponseEntity<Map<String, String>> createCheckoutSession(
            @PathVariable Long fineId) {
        Session session = paymentService.createStripeCheckoutSession(fineId);
        Map<String, String> response = new HashMap<>();
        response.put("checkoutUrl", session.getUrl());
        response.put("sessionId", session.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-checkout-session")
    public ResponseEntity<Payment> verifyCheckoutSession(
            @RequestParam String sessionId) {
        return ResponseEntity.ok(paymentService.verifyStripePayment(sessionId));
    }

    @GetMapping("/{fineId}")
    public ResponseEntity<Payment> getPaymentByFine(
            @PathVariable Long fineId) {
        return ResponseEntity.ok(paymentService.getPaymentByFine(fineId));
    }
}