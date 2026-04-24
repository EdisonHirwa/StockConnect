package com.stockconnect.config;

import com.stockconnect.models.Company;
import com.stockconnect.models.PortfolioHolding;
import com.stockconnect.models.Role;
import com.stockconnect.models.User;
import com.stockconnect.models.Wallet;
import com.stockconnect.repositories.CompanyRepository;
import com.stockconnect.repositories.PortfolioHoldingRepository;
import com.stockconnect.repositories.UserRepository;
import com.stockconnect.repositories.WalletRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final WalletRepository walletRepository;
    private final PortfolioHoldingRepository portfolioHoldingRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.super-admin.full-name}")
    private String superAdminFullName;

    @Value("${app.super-admin.email}")
    private String superAdminEmail;

    @Value("${app.super-admin.password}")
    private String superAdminPassword;

    @Value("${app.super-admin.phone-number}")
    private String superAdminPhoneNumber;

    public DataSeeder(UserRepository userRepository,
                      CompanyRepository companyRepository,
                      WalletRepository walletRepository,
                      PortfolioHoldingRepository portfolioHoldingRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.walletRepository = walletRepository;
        this.portfolioHoldingRepository = portfolioHoldingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedSuperAdmin();
        seedCompanies();
        seedSystemMarketMaker();
    }

    // ── Super Admin ───────────────────────────────────────────────────────────
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

    // ── Companies ─────────────────────────────────────────────────────────────
    private void seedCompanies() {
        if (companyRepository.count() > 0) {
            log.info("[Seeder] Companies already exist — skipping company seed.");
            return;
        }

        List<Company> rwandanCompanies = List.of(
            createCompany("Bank of Kigali Group Plc", "BKG", 4000000L, new BigDecimal("270")),
            createCompany("Bralirwa Plc",             "BLR", 2500000L, new BigDecimal("180")),
            createCompany("Crystal Telecom",           "CTL", 1500000L, new BigDecimal("75")),
            createCompany("I&M Bank Rwanda",           "IMR", 1200000L, new BigDecimal("45")),
            createCompany("MTN Rwandacell Plc",        "MTN", 5000000L, new BigDecimal("170"))
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

    // ── System Market Maker ───────────────────────────────────────────────────
    // This internal account is the instant counter-party for every MARKET order.
    // It must always exist with an effectively unlimited wallet balance and
    // a large share position in every listed company so the matching engine
    // can fill trader BUY orders immediately.
    private void seedSystemMarketMaker() {
        final String email              = "admin@stockconnect.com";
        final BigDecimal SYSTEM_BALANCE = new BigDecimal("999999999999");
        final long SYSTEM_SHARES        = 50_000_000L;
        final BigDecimal COST_BASIS     = BigDecimal.ONE; // accounting placeholder

        // 1. Ensure the user account exists
        User maker = userRepository.findByEmail(email).orElseGet(() -> {
            User u = User.builder()
                    .fullName("System Market Maker")
                    .email(email)
                    .phoneNumber("+250000000000")
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .role(Role.SUPER_ADMIN)
                    .build();
            userRepository.save(u);
            log.info("[Seeder] System Market Maker account created: {}", email);
            return u;
        });

        // 2. Ensure the wallet is funded
        Wallet wallet = walletRepository.findByUserId(maker.getId()).orElseGet(() -> {
            Wallet w = new Wallet(maker, BigDecimal.ZERO);
            return walletRepository.save(w);
        });
        if (wallet.getBalance().compareTo(SYSTEM_BALANCE) < 0) {
            wallet.setBalance(SYSTEM_BALANCE);
            walletRepository.save(wallet);
            log.info("[Seeder] System Market Maker wallet funded.");
        }

        // 3. Ensure the market maker holds shares in every listed company
        List<Company> companies = companyRepository.findAll();
        for (Company company : companies) {
            boolean hasHolding = portfolioHoldingRepository
                    .findByUserIdAndCompanyId(maker.getId(), company.getId())
                    .isPresent();
            if (!hasHolding) {
                PortfolioHolding holding = new PortfolioHolding();
                holding.setUser(maker);
                holding.setCompany(company);
                holding.setQuantity(SYSTEM_SHARES);
                holding.setLockedQuantity(0L);
                holding.setAverageBuyPrice(COST_BASIS);
                portfolioHoldingRepository.save(holding);
                log.info("[Seeder] Seeded {} shares of {} for System Market Maker",
                        SYSTEM_SHARES, company.getTickerSymbol());
            }
        }

        log.info("[Seeder] System Market Maker is ready.");
    }
}
