package com.traffic.backend.controller;

import com.traffic.backend.dto.FineDTO;
import com.traffic.backend.model.Fine;
import com.traffic.backend.service.FineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fines")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FineController {

    private final FineService fineService;

    @GetMapping
    public ResponseEntity<List<Fine>> getAllFines() {
        return ResponseEntity.ok(fineService.getAllFines());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fine> getFineById(@PathVariable Long id) {
        return ResponseEntity.ok(fineService.getFineById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Fine>> getFinesByUser(
            @PathVariable Long userId) {
        return ResponseEntity.ok(fineService.getFinesByUser(userId));
    }

    @GetMapping("/vehicle/{plate}")
    public ResponseEntity<List<Fine>> getFinesByVehicle(
            @PathVariable String plate) {
        return ResponseEntity.ok(fineService.getFinesByVehicle(plate));
    }

    @PostMapping
    public ResponseEntity<Fine> issueFine(@RequestBody FineDTO dto) {
        return ResponseEntity.ok(fineService.issueFine(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fine> updateFine(
            @PathVariable Long id,
            @RequestBody FineDTO dto) {
        return ResponseEntity.ok(fineService.updateFine(id, dto));
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<Fine> markAsPaid(@PathVariable Long id) {
        return ResponseEntity.ok(fineService.markAsPaid(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFine(@PathVariable Long id) {
        fineService.deleteFine(id);
        return ResponseEntity.noContent().build();
    }
}