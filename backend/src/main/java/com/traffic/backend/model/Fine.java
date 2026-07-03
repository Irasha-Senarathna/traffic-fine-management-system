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

    private String district;      // e.g. "Colombo", "Kandy", "Galle"
    private String fineCategory;  // e.g. "Speeding", "Parking", "Signal Violation"

    private LocalDateTime issuedAt;

    /** The citizen who owns this fine */
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    /** The police officer who issued this fine (receives SMS on payment) */
    @ManyToOne
    @JoinColumn(name = "issued_by_id")
    private User issuedBy;
}