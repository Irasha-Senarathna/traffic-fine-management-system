package com.traffic.backend;

import com.traffic.backend.dto.FineDTO;
import com.traffic.backend.model.Fine;
import com.traffic.backend.model.User;
import com.traffic.backend.repository.FineRepository;
import com.traffic.backend.repository.UserRepository;
import com.traffic.backend.service.FineService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FineServiceTest {

    @Mock
    private FineRepository fineRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private FineService fineService;

    @Test
    void testIssueFineSuccess() {
        FineDTO dto = new FineDTO();
        dto.setVehiclePlate("ABC-1234");
        dto.setReason("Speeding");
        dto.setAmount(5000.0);
        dto.setUserId(1L);

        User user = new User();
        user.setId(1L);

        Fine fine = new Fine();
        fine.setVehiclePlate("ABC-1234");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(fineRepository.save(any(Fine.class))).thenReturn(fine);

        Fine result = fineService.issueFine(dto);

        assertEquals("ABC-1234", result.getVehiclePlate());
        verify(fineRepository, times(1)).save(any(Fine.class));
    }

    @Test
    void testMarkAsPaid() {
        Fine fine = new Fine();
        fine.setId(1L);
        fine.setStatus("UNPAID");

        when(fineRepository.findById(1L)).thenReturn(Optional.of(fine));
        when(fineRepository.save(any(Fine.class))).thenReturn(fine);

        Fine result = fineService.markAsPaid(1L);

        assertEquals("PAID", result.getStatus());
    }

    @Test
    void testGetFineByIdNotFound() {
        when(fineRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> fineService.getFineById(99L));
    }
}


//refactor