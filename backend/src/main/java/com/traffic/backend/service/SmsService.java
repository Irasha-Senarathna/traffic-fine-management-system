package com.traffic.backend.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${twilio.account.sid:}")
    private String accountSid;

    @Value("${twilio.auth.token:}")
    private String authToken;

    @Value("${twilio.from.number:}")
    private String fromNumber;

    private boolean configured = false;

    @PostConstruct
    public void init() {
        if (accountSid != null && !accountSid.isBlank()) {
            Twilio.init(accountSid, authToken);
            configured = true;
        }
    }

    public void sendPaymentConfirmation(String toPhone, String vehiclePlate, Long fineId) {
        if (!configured || toPhone == null || toPhone.isBlank()) {
            return;
        }
        String body = "Fine #" + fineId + " for vehicle " + vehiclePlate +
                      " has been paid. Driver may retrieve their license.";
        Message.creator(
                new PhoneNumber(toPhone),
                new PhoneNumber(fromNumber),
                body
        ).create();
    }
}
