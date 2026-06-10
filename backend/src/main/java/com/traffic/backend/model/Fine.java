package com.traffic.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "fines")
public class Fine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehiclePlate;
    private String reason;
    private Double amount;
    private String status; // UNPAID, PAID

    private LocalDateTime issuedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}