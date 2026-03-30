package com.stockconnect.services;

import com.stockconnect.dto.AuthResponseDTO;
import com.stockconnect.dto.LoginRequestDTO;
import com.stockconnect.dto.RegisterRequestDTO;
import com.stockconnect.exceptions.EmailAlreadyTakenException;
import com.stockconnect.models.Role;
import com.stockconnect.models.User;
import com.stockconnect.repositories.UserRepository;
import com.stockconnect.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Set;

@Service
public class AuthService {

    /** Roles that may NOT be chosen through the public registration form. */
    private static final Set<String> RESTRICTED_ROLES = Set.of("SUPER_ADMIN");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository      = userRepository;
        this.passwordEncoder     = passwordEncoder;
        this.jwtService          = jwtService;
        this.authenticationManager = authenticationManager;
    }

    // ── Register ─────────────────────────────────────────────────────────────

    public User register(RegisterRequestDTO dto) {

        // Guard: block restricted roles from public registration
        if (dto.getRole() == null || RESTRICTED_ROLES.contains(dto.getRole().toUpperCase())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Role '" + dto.getRole() + "' cannot be registered publicly."
            );
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new EmailAlreadyTakenException("Email already registered: " + dto.getEmail());
        }

        Role role;
        try {
            role = Role.valueOf(dto.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role: " + dto.getRole());
        }

        User user = User.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(role)
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
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }
}
