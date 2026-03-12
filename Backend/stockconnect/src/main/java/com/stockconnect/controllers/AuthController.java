package com.stockconnect.controllers;

import com.stockconnect.dto.AuthResponseDTO;
import com.stockconnect.dto.LoginRequestDTO;
import com.stockconnect.dto.RegisterRequestDTO;
import com.stockconnect.models.User;
import com.stockconnect.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * POST /api/auth/register
     * Creates a new TRADER account.
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(
            @Valid @RequestBody RegisterRequestDTO dto) {

        User user = authService.register(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "userId",  user.getId().toString(),
                "email",   user.getEmail(),
                "role",    user.getRole().name(),
                "message", "Registration successful."
        ));
    }

    /**
     * POST /api/auth/login
     * Validates credentials and returns a JWT access + refresh token pair.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO dto) {

        AuthResponseDTO response = authService.login(dto);
        return ResponseEntity.ok(response);
    }
}
