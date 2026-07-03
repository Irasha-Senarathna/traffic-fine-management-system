package com.traffic.backend.controller;

import com.traffic.backend.dto.CreateOfficerRequest;
import com.traffic.backend.model.Role;
import com.traffic.backend.model.User;
import com.traffic.backend.repository.UserRepository;
import com.traffic.backend.service.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminStatsService adminStatsService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ── Stats ──────────────────────────────────────────────────────────────

    /** Overall summary stats */
    @GetMapping("/stats/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(adminStatsService.getSummary());
    }

    /** Total collected per district */
    @GetMapping("/stats/by-district")
    public ResponseEntity<Map<String, Object>> getByDistrict() {
        return ResponseEntity.ok(adminStatsService.getByDistrict());
    }

    /** Total collected per fine category */
    @GetMapping("/stats/by-category")
    public ResponseEntity<Map<String, Object>> getByCategory() {
        return ResponseEntity.ok(adminStatsService.getByCategory());
    }

    // ── Officer Management ─────────────────────────────────────────────────

    /** List all police officers */
    @GetMapping("/officers")
    public ResponseEntity<List<User>> getOfficers() {
        return ResponseEntity.ok(userRepository.findByRole(Role.OFFICER));
    }

    /** Create a new police officer account */
    @PostMapping("/officers")
    public ResponseEntity<User> createOfficer(@RequestBody CreateOfficerRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }

        User officer = new User();
        officer.setName(req.getName());
        officer.setEmail(req.getEmail());
        officer.setPhone(req.getPhone());
        officer.setPassword(passwordEncoder.encode(req.getPassword()));
        officer.setRole(Role.OFFICER);

        return ResponseEntity.status(HttpStatus.CREATED).body(userRepository.save(officer));
    }

    /** Delete a police officer account */
    @DeleteMapping("/officers/{id}")
    public ResponseEntity<Void> deleteOfficer(@PathVariable Long id) {
        User officer = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Officer not found"));
        if (officer.getRole() != Role.OFFICER) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is not an officer");
        }
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
