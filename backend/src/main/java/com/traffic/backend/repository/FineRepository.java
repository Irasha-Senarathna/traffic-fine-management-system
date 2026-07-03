package com.traffic.backend.repository;

import com.traffic.backend.model.Fine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface FineRepository extends JpaRepository<Fine, Long> {
    List<Fine> findByUserId(Long userId);
    List<Fine> findByVehiclePlate(String vehiclePlate);

    long countByStatus(String status);

    @Query("SELECT SUM(f.amount) FROM Fine f WHERE f.status = :status")
    Double sumAmountByStatus(@Param("status") String status);

    @Query("SELECT f.district, SUM(f.amount), COUNT(f) FROM Fine f GROUP BY f.district ORDER BY SUM(f.amount) DESC")
    List<Object[]> sumAmountGroupByDistrict();

    @Query("SELECT f.fineCategory, SUM(f.amount), COUNT(f) FROM Fine f GROUP BY f.fineCategory ORDER BY SUM(f.amount) DESC")
    List<Object[]> sumAmountGroupByCategory();

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query("UPDATE Fine f SET f.fineCategory = f.reason WHERE f.fineCategory IS NULL OR f.fineCategory = ''")
    int populateMissingFineCategories();
}