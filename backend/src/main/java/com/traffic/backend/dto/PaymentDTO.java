package com.traffic.backend.dto;

import lombok.Data;

@Data
public class PaymentDTO {
    private Long fineId;
    private Double amount;
}