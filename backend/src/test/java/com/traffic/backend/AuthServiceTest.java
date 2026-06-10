package com.traffic.backend;

import com.traffic.backend.dto.LoginRequest;
import com.traffic.backend.dto.RegisterRequest;
import com.traffic.backend.model.User;
import com.traffic.backend.repository.UserRepository;
import com.traffic.backend.security.JwtUtil;
import com.traffic.backend.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    @Test
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Ira Test");
        request.setEmail("ira@test.com");
        request.setPassword("123456");
        request.setNic("123456789V");

        // Use anyString() if specific behavior for existsByEmail is required
        when(userRepository.existsByEmail("ira@test.com")).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("encodedPassword");

        Map<String, String> response = authService.register(request);

        assertEquals("User registered successfully", response.get("message"));
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("ira@test.com");

        when(userRepository.existsByEmail("ira@test.com")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.register(request));
    }

    @Test
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest();
        request.setEmail("ira@test.com");
        request.setPassword("123456");

        User user = new User();
        user.setEmail("ira@test.com");
        user.setPassword("encodedPassword");

        when(userRepository.findByEmail("ira@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("123456", "encodedPassword")).thenReturn(true);
        when(jwtUtil.generateToken("ira@test.com")).thenReturn("mockToken");

        Map<String, String> response = authService.login(request);

        assertEquals("mockToken", response.get("token"));
    }

    @Test
    void testLoginInvalidPassword() {
        LoginRequest request = new LoginRequest();
        request.setEmail("ira@test.com");
        request.setPassword("wrongpassword");

        User user = new User();
        user.setEmail("ira@test.com");
        user.setPassword("encodedPassword");

        when(userRepository.findByEmail("ira@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpassword", "encodedPassword")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> authService.login(request));
    }
}
