package com.traffic.backend.dto;

import lombok.Data;

@Data
public class CreateOfficerRequest {
    private String name;
    private String email;
    private String phone;
    /** Plain-text password chosen by admin; will be BCrypt-encoded on the backend */
    private String password;
}
