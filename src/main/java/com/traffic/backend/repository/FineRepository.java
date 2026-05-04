package com.traffic.backend.repository;

import com.traffic.backend.model.Fine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FineRepository extends JpaRepository<Fine, Long> {
    List<Fine> findByUserId(Long userId);
    List<Fine> findByVehiclePlate(String vehiclePlate);
}