package com.stockconnect.config;

import com.stockconnect.models.Role;
import com.stockconnect.models.User;
import com.stockconnect.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.super-admin.full-name}")
    private String superAdminFullName;

    @Value("${app.super-admin.email}")
    private String superAdminEmail;

    @Value("${app.super-admin.password}")
    private String superAdminPassword;

    @Value("${app.super-admin.phone-number}")
    private String superAdminPhoneNumber;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository  = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.existsByRole(Role.SUPER_ADMIN)) {
            log.info("[Seeder] Super Admin already exists — skipping seed.");
            return;
        }

        User superAdmin = User.builder()
                .fullName(superAdminFullName)
                .email(superAdminEmail)
                .phoneNumber(superAdminPhoneNumber)
                .password(passwordEncoder.encode(superAdminPassword))
                .role(Role.SUPER_ADMIN)
                .build();

        userRepository.save(superAdmin);
        log.info("[Seeder] Super Admin created successfully: {}", superAdminEmail);
    }
}
