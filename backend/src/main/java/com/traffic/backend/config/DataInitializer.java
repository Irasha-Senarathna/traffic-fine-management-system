package com.traffic.backend.config;

import com.traffic.backend.model.Role;
import com.traffic.backend.model.User;
import com.traffic.backend.repository.UserRepository;
import com.traffic.backend.repository.FineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final FineRepository fineRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.name}")
    private String adminName;

    @Override
    public void run(ApplicationArguments args) {
        try {
            int updated = fineRepository.populateMissingFineCategories();
            if (updated > 0) {
                log.info("Populated missing fine categories for {} records", updated);
            }
        } catch (Exception e) {
            log.error("Failed to populate missing fine categories: {}", e.getMessage());
        }

        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setName(adminName);
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setNic("000000000V");
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            log.info("=======================================================");
            log.info("  Default admin account created:");
            log.info("  Email   : {}", adminEmail);
            log.info("  CHANGE THIS PASSWORD IN PRODUCTION!");
            log.info("=======================================================");
        } else {
            log.info("Admin account already exists — skipping seed.");
        }
    }
}
