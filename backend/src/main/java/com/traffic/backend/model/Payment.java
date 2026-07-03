package com.traffic.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;
    private LocalDateTime paidAt;
    private String transactionId;

    @OneToOne
    @JoinColumn(name = "fine_id")
    private Fine fine;
}