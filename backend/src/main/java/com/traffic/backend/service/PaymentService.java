package com.traffic.backend.service;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.traffic.backend.dto.PaymentDTO;
import com.traffic.backend.model.Fine;
import com.traffic.backend.model.Payment;
import com.traffic.backend.repository.FineRepository;
import com.traffic.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final FineRepository fineRepository;
    private final SmsService smsService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

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
            // SMS goes to the officer who issued the fine, not the citizen
            if (fine.getIssuedBy() != null && fine.getIssuedBy().getPhone() != null) {
                smsService.sendPaymentNotification(
                        fine.getIssuedBy().getPhone(),
                        fine.getVehiclePlate(),
                        fine.getId()
                );
            }
        } catch (Exception ignored) {
            // SMS failure must never roll back a successful payment
        }

        return saved;
    }

    public Session createStripeCheckoutSession(Long fineId) {
        if (com.stripe.Stripe.apiKey == null || com.stripe.Stripe.apiKey.isEmpty() || "sk_test_placeholder".equals(com.stripe.Stripe.apiKey)) {
            throw new RuntimeException("Stripe API key is not configured. Please paste your valid sandbox secret key (sk_test_...) into application-local.properties");
        }

        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new RuntimeException("Fine not found"));

        if ("PAID".equals(fine.getStatus())) {
            throw new RuntimeException("Fine is already paid");
        }

        long amountInCents = Math.round(fine.getAmount() * 100);

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(frontendUrl + "/payment-success?session_id={CHECKOUT_SESSION_ID}&fineId=" + fineId)
                .setCancelUrl(frontendUrl + "/payments/" + fineId)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("lkr")
                                                .setUnitAmount(amountInCents)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Traffic Fine #" + fine.getId())
                                                                .setDescription("Violation: " + fine.getReason() + " (Vehicle: " + fine.getVehiclePlate() + ")")
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .putMetadata("fineId", String.valueOf(fineId))
                .build();

        try {
            return Session.create(params);
        } catch (StripeException e) {
            throw new RuntimeException("Failed to create Stripe checkout session: " + e.getMessage(), e);
        }
    }

    public Payment verifyStripePayment(String sessionId) {
        if (com.stripe.Stripe.apiKey == null || com.stripe.Stripe.apiKey.isEmpty() || "sk_test_placeholder".equals(com.stripe.Stripe.apiKey)) {
            throw new RuntimeException("Stripe API key is not configured. Please configure a valid secret key.");
        }

        Optional<Payment> existingPayment = paymentRepository.findByTransactionId(sessionId);
        if (existingPayment.isPresent()) {
            return existingPayment.get();
        }

        try {
            Session session = Session.retrieve(sessionId);
            if (!"paid".equals(session.getPaymentStatus())) {
                throw new RuntimeException("Stripe payment not completed. Status: " + session.getPaymentStatus());
            }

            String fineIdStr = session.getMetadata().get("fineId");
            if (fineIdStr == null) {
                throw new RuntimeException("Fine ID not found in session metadata");
            }
            Long fineId = Long.parseLong(fineIdStr);

            Fine fine = fineRepository.findById(fineId)
                    .orElseThrow(() -> new RuntimeException("Fine not found for ID: " + fineId));

            if ("PAID".equals(fine.getStatus())) {
                return paymentRepository.findByFineId(fineId)
                        .orElseGet(() -> {
                            Payment payment = new Payment();
                            payment.setAmount(session.getAmountTotal() / 100.0);
                            payment.setPaidAt(LocalDateTime.now());
                            payment.setFine(fine);
                            payment.setTransactionId(sessionId);
                            return paymentRepository.save(payment);
                        });
            }

            Payment payment = new Payment();
            payment.setAmount(session.getAmountTotal() / 100.0);
            payment.setPaidAt(LocalDateTime.now());
            payment.setFine(fine);
            payment.setTransactionId(sessionId);

            fine.setStatus("PAID");
            fineRepository.save(fine);

            Payment saved = paymentRepository.save(payment);

            try {
                if (fine.getIssuedBy() != null && fine.getIssuedBy().getPhone() != null) {
                    smsService.sendPaymentNotification(
                            fine.getIssuedBy().getPhone(),
                            fine.getVehiclePlate(),
                            fine.getId()
                    );
                }
            } catch (Exception ignored) {
            }

            return saved;
        } catch (StripeException e) {
            throw new RuntimeException("Stripe API error: " + e.getMessage(), e);
        }
    }

    public Payment getPaymentByFine(Long fineId) {
        return paymentRepository.findByFineId(fineId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }
}