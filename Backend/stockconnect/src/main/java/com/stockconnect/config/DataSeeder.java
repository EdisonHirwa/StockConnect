package com.stockconnect.config;

import com.stockconnect.models.Role;
import com.stockconnect.models.User;
import com.stockconnect.models.Company;
import com.stockconnect.repositories.UserRepository;
import com.stockconnect.repositories.CompanyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository  userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.super-admin.full-name}")
    private String superAdminFullName;

    @Value("${app.super-admin.email}")
    private String superAdminEmail;

    @Value("${app.super-admin.password}")
    private String superAdminPassword;

    @Value("${app.super-admin.phone-number}")
    private String superAdminPhoneNumber;

    public DataSeeder(UserRepository userRepository, CompanyRepository companyRepository, PasswordEncoder passwordEncoder) {
        this.userRepository  = userRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedSuperAdmin();
        seedCompanies();
    }

    private void seedSuperAdmin() {
        userRepository.findByRole(Role.SUPER_ADMIN).ifPresentOrElse(
            existing -> {
                // Always sync credentials from env so a misconfigured first-start
                // never permanently locks the admin account.
                existing.setFullName(superAdminFullName);
                existing.setEmail(superAdminEmail);
                existing.setPhoneNumber(superAdminPhoneNumber);
                existing.setPassword(passwordEncoder.encode(superAdminPassword));
                userRepository.save(existing);
                log.info("[Seeder] Super Admin credentials synced from env: {}", superAdminEmail);
            },
            () -> {
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
        );
    }

    private void seedCompanies() {
        if (companyRepository.count() > 0) {
            log.info("[Seeder] Companies already exist — skipping company seed.");
            return;
        }

        List<Company> rwandanCompanies = List.of(
            createCompany("Bank of Kigali Group Plc", "BKG", 4000000L, new BigDecimal("270")),
            createCompany("Bralirwa Plc", "BLR", 2500000L, new BigDecimal("180")),
            createCompany("Crystal Telecom", "CTL", 1500000L, new BigDecimal("75")),
            createCompany("I&M Bank Rwanda", "IMR", 1200000L, new BigDecimal("45")),
            createCompany("MTN Rwandacell Plc", "MTN", 5000000L, new BigDecimal("170"))
        );

        companyRepository.saveAll(rwandanCompanies);
        log.info("[Seeder] Inserted {} sample Rwandan companies.", rwandanCompanies.size());
    }

    private Company createCompany(String name, String ticker, Long totalShares, BigDecimal price) {
        Company company = new Company();
        company.setCompanyName(name);
        company.setTickerSymbol(ticker);
        company.setTotalShares(totalShares);
        company.setCurrentPrice(price);
        return company;
    }
}
