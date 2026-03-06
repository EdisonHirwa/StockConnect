package com.stockconnect.services;

import com.stockconnect.dto.AuthResponseDTO;
import com.stockconnect.dto.LoginRequestDTO;
import com.stockconnect.dto.RegisterRequestDTO;
import com.stockconnect.exceptions.EmailAlreadyTakenException;
import com.stockconnect.models.Role;
import com.stockconnect.models.User;
import com.stockconnect.repositories.UserRepository;
import com.stockconnect.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    // ── Register ─────────────────────────────────────────────────────────────

    public User register(RegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new EmailAlreadyTakenException("Email already registered: " + dto.getEmail());
        }

        User user = User.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(Role.TRADER)
                .build();

        return userRepository.save(user);
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    public AuthResponseDTO login(LoginRequestDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
        );

        User user = userRepository.findByEmail(dto.getEmail()).orElseThrow();

        String accessToken  = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getAccessTokenExpMs() / 1000)
                .userId(user.getId().toString())
                .role(user.getRole().name())
                .build();
    }
}
