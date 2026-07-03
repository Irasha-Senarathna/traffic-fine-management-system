package com.traffic.backend.service;

import com.traffic.backend.dto.FineDTO;
import com.traffic.backend.model.Fine;
import com.traffic.backend.model.User;
import com.traffic.backend.repository.FineRepository;
import com.traffic.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FineService {

    private final FineRepository fineRepository;
    private final UserRepository userRepository;

    @SuppressWarnings("null")
    public Fine issueFine(FineDTO dto) {
        User user = null;
        if (dto.getOwnerNic() != null && !dto.getOwnerNic().trim().isEmpty()) {
            user = userRepository.findByNic(dto.getOwnerNic().trim())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Driver with NIC " + dto.getOwnerNic() + " not found"));
        } else if (dto.getUserId() != null) {
            user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Driver's NIC is required to issue a fine");
        }

        Fine fine = new Fine();
        fine.setVehiclePlate(dto.getVehiclePlate());
        fine.setReason(dto.getReason());
        fine.setAmount(dto.getAmount());
        fine.setStatus("UNPAID");
        fine.setIssuedAt(LocalDateTime.now());
        fine.setUser(user);
        fine.setDistrict(dto.getDistrict());
        fine.setFineCategory(dto.getFineCategory() != null && !dto.getFineCategory().trim().isEmpty()
                ? dto.getFineCategory()
                : dto.getReason());

        // Link issuing officer if provided
        if (dto.getOfficerId() != null) {
            userRepository.findById(dto.getOfficerId())
                    .ifPresent(fine::setIssuedBy);
        }

        return fineRepository.save(fine);
    }



    public List<Fine> getAllFines() {
        return fineRepository.findAll();
    }

    @SuppressWarnings("null")
    public Fine getFineById(Long id) {
        return fineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fine not found"));
    }

    public List<Fine> getFinesByUser(Long userId) {
        return fineRepository.findByUserId(userId);
    }

    public List<Fine> getFinesByVehicle(String plate) {
        return fineRepository.findByVehiclePlate(plate);
    }

    public Fine updateFine(Long id, FineDTO dto) {
        Fine fine = getFineById(id);
        fine.setVehiclePlate(dto.getVehiclePlate());
        fine.setReason(dto.getReason());
        fine.setAmount(dto.getAmount());
        return fineRepository.save(fine);
    }

    public Fine markAsPaid(Long id) {
    Fine fine = getFineById(id);

    if (fine.getStatus().equals("PAID")) {
        throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST, "Fine already paid"
        );
    }

    fine.setStatus("PAID");
    return fineRepository.save(fine);
}

    @SuppressWarnings("null")
    public void deleteFine(Long id) {
        fineRepository.deleteById(id);
    }
}