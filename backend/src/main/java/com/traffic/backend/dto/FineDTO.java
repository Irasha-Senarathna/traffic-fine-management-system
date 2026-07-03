package com.traffic.backend.dto;

import lombok.Data;

@Data
public class FineDTO {
    private String vehiclePlate;
    private String reason;
    private Double amount;
    private Long userId;
    private String ownerNic;
    private String district;
    private String fineCategory;
    /** ID of the police officer issuing this fine (optional) */
    private Long officerId;
}