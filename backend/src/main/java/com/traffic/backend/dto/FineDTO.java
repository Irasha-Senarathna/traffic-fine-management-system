package com.traffic.backend.dto;

import lombok.Data;

@Data
public class FineDTO {
    private String vehiclePlate;
    private String reason;
    private Double amount;
    private Long userId;
}