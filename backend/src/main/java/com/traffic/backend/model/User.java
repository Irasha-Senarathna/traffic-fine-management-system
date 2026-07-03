package com.traffic.backend.model;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    @JsonIgnore
    private String password;

    private String nic;

    /** Phone number used for notify.lk SMS (primarily for police officers) */
    private String phone;

    @Enumerated(EnumType.STRING)
    private Role role;
}