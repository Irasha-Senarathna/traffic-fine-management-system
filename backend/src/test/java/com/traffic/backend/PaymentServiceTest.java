package com.traffic.backend;

import com.traffic.backend.dto.PaymentDTO;
import com.traffic.backend.model.Fine;
import com.traffic.backend.model.Payment;
import com.traffic.backend.repository.FineRepository;
import com.traffic.backend.repository.PaymentRepository;
import com.traffic.backend.service.PaymentService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private FineRepository fineRepository;

    @InjectMocks
    private PaymentService paymentService;

    @Test
    void testProcessPaymentSuccess() {
        PaymentDTO dto = new PaymentDTO();
        dto.setFineId(1L);
        dto.setAmount(5000.0);

        Fine fine = new Fine();
        fine.setId(1L);
        fine.setStatus("UNPAID");

        Payment payment = new Payment();
        payment.setAmount(5000.0);

        when(fineRepository.findById(1L)).thenReturn(Optional.of(fine));
        when(paymentRepository.save(any(Payment.class))).thenReturn(payment);

        Payment result = paymentService.processPayment(dto);

        assertEquals(5000.0, result.getAmount());
        verify(paymentRepository, times(1)).save(any(Payment.class));
    }

    @Test
    void testProcessPaymentAlreadyPaid() {
        PaymentDTO dto = new PaymentDTO();
        dto.setFineId(1L);

        Fine fine = new Fine();
        fine.setId(1L);
        fine.setStatus("PAID");

        when(fineRepository.findById(1L)).thenReturn(Optional.of(fine));

        assertThrows(RuntimeException.class, () -> paymentService.processPayment(dto));
    }
}
