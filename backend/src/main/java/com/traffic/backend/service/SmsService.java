package com.traffic.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Slf4j
@Service
public class SmsService {

    @Value("${notifylk.user_id:}")
    private String userId;

    @Value("${notifylk.api_key:}")
    private String apiKey;

    @Value("${notifylk.sender_id:NotifyDEMO}")
    private String senderId;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Sends an SMS to a police officer when a fine they issued has been paid.
     *
     * @param phone       Officer's phone number (e.g. "0771234567" or "94771234567")
     * @param vehiclePlate Vehicle plate of the paid fine
     * @param fineId      Fine ID
     */
    public void sendPaymentNotification(String phone, String vehiclePlate, Long fineId) {
        if (userId == null || userId.isBlank() || apiKey == null || apiKey.isBlank()) {
            log.warn("notify.lk credentials not configured — SMS skipped for fine #{}", fineId);
            return;
        }
        if (phone == null || phone.isBlank()) {
            log.warn("Officer has no phone number — SMS skipped for fine #{}", fineId);
            return;
        }

        // Normalise to international format (94XXXXXXXXX)
        String normalised = phone.trim().replaceAll("\\s+", "");
        if (normalised.startsWith("0")) {
            normalised = "94" + normalised.substring(1);
        }

        String message = "[Traffic Fines Sri Lanka]\n" +
                         "Payment confirmed for Fine #" + fineId + "\n" +
                         "Vehicle No: " + vehiclePlate + "\n" +
                         "Status: RESOLVED (Paid)\n" +
                         "You may now return the held license.";

        java.net.URI uri = UriComponentsBuilder
                .fromHttpUrl("https://app.notify.lk/api/v1/send")
                .queryParam("user_id",   userId)
                .queryParam("api_key",   apiKey)
                .queryParam("sender_id", senderId)
                .queryParam("to",        normalised)
                .queryParam("message",   message)
                .build()
                .toUri();

        try {
            String response = restTemplate.getForObject(uri, String.class);
            log.info("notify.lk response for fine #{}: {}", fineId, response);
        } catch (Exception e) {
            log.error("Failed to send SMS via notify.lk for fine #{}: {}", fineId, e.getMessage());
        }
    }
}
