package com.stockconnect.controllers;

import com.stockconnect.dto.MarketAnalyticsDTO;
import com.stockconnect.dto.LeaderboardDTO;
import com.stockconnect.dto.MarketStatsDTO;
import com.stockconnect.dto.OrderDTO;
import com.stockconnect.dto.TradeDTO;
import com.stockconnect.models.*;
import com.stockconnect.repositories.*;
import com.stockconnect.services.CompanyService;
import com.stockconnect.services.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class MarketAdminController {

    @Autowired
    private CompanyService companyService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private TradeRepository tradeRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private MarketSessionRepository marketSessionRepository;

    @GetMapping("/companies")
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @PostMapping("/admin/companies")
    public ResponseEntity<Company> createCompany(@RequestBody CompanyCreateRequest request) {
        Company company = companyService.createCompany(request.companyName(), request.tickerSymbol(), request.currentPrice(), request.totalShares());
        return ResponseEntity.ok(company);
    }

    @PutMapping("/admin/companies/{id}/price")
    public ResponseEntity<Company> updatePrice(@PathVariable UUID id, @RequestParam BigDecimal newPrice) {
        return ResponseEntity.ok(companyService.updateCompanyPrice(id, newPrice));
    }

    @GetMapping("/admin/stats")
    public ResponseEntity<MarketStatsDTO> getStats() {
        long activeTraders = userRepository.countByRole(Role.TRADER);
        long ordersToday = orderRepository.count(); // Simplified to total count for now
        long tradesExecuted = tradeRepository.count();
        
        BigDecimal totalVolume = tradeRepository.findAll().stream()
                .map(t -> t.getExecutionPrice().multiply(BigDecimal.valueOf(t.getExecutionQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ResponseEntity.ok(new MarketStatsDTO(activeTraders, ordersToday, tradesExecuted, totalVolume));
    }

    @GetMapping("/admin/trades")
    public ResponseEntity<List<TradeDTO>> getAllTrades() {
        return ResponseEntity.ok(tradeRepository.findAllByOrderByExecutedAtDesc()
                .stream()
                .map(TradeDTO::from)
                .collect(Collectors.toList()));
    }

    @GetMapping("/admin/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(OrderDTO::from)
                .collect(Collectors.toList()));
    }

    @GetMapping("/admin/leaderboard")
    public ResponseEntity<List<LeaderboardDTO>> getLeaderboard() {
        List<User> traders = userRepository.findAllByRole(Role.TRADER);
        BigDecimal startingBalance = new BigDecimal("1000000"); // Standard starting balance

        List<LeaderboardDTO> leaderboard = traders.stream().map(user -> {
            BigDecimal walletBalance = walletRepository.findByUserId(user.getId())
                    .map(w -> w.getBalance())
                    .orElse(BigDecimal.ZERO);
            
            List<PortfolioHolding> holdings = portfolioService.getPortfolio(user.getId());
            BigDecimal portfolioValue = holdings.stream()
                    .map(h -> h.getCompany().getCurrentPrice().multiply(BigDecimal.valueOf(h.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            BigDecimal netWorth = walletBalance.add(portfolioValue);
            BigDecimal gain = netWorth.subtract(startingBalance);
            BigDecimal gainPercentage = startingBalance.compareTo(BigDecimal.ZERO) > 0 
                    ? gain.multiply(new BigDecimal("100")).divide(startingBalance, 2, java.math.RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
            
            long tradesCount = tradeRepository.findAll().stream()
                    .filter(t -> t.getBuyer().getId().equals(user.getId()) || t.getSeller().getId().equals(user.getId()))
                    .count();

            String initials = "";
            if (user.getFullName() != null && !user.getFullName().isEmpty()) {
                String[] parts = user.getFullName().split(" ");
                if (parts.length > 0) initials += parts[0].charAt(0);
                if (parts.length > 1) initials += parts[1].charAt(0);
            }

            return new LeaderboardDTO(
                user.getId(),
                user.getFullName(),
                initials.toUpperCase(),
                startingBalance,
                netWorth,
                gainPercentage,
                tradesCount
            );
        })
        .sorted((a, b) -> b.currentNetWorth().compareTo(a.currentNetWorth()))
        .collect(Collectors.toList());

        return ResponseEntity.ok(leaderboard);
    }

    @GetMapping("/admin/analytics")
    public ResponseEntity<MarketAnalyticsDTO> getAnalytics() {
        List<Company> companies = companyService.getAllCompanies();
        Map<String, Long> industryDistribution = companies.stream()
                .collect(Collectors.groupingBy(Company::getSector, Collectors.counting()));

        // Simple volume points based on recent trades
        List<Trade> trades = tradeRepository.findAll();
        // Just for demo/mock real integration, map trades to volume points
        // In a real app, you'd group by date.
        List<MarketAnalyticsDTO.VolumeDataPoint> volumeHistory = List.of(
            new MarketAnalyticsDTO.VolumeDataPoint("Mon", new BigDecimal("4000"), new BigDecimal("2400")),
            new MarketAnalyticsDTO.VolumeDataPoint("Tue", new BigDecimal("3000"), new BigDecimal("1398")),
            new MarketAnalyticsDTO.VolumeDataPoint("Wed", new BigDecimal("2000"), new BigDecimal("9800")),
            new MarketAnalyticsDTO.VolumeDataPoint("Thu", new BigDecimal("2780"), new BigDecimal("3908")),
            new MarketAnalyticsDTO.VolumeDataPoint("Fri", new BigDecimal("1890"), new BigDecimal("4800"))
        );

        return ResponseEntity.ok(new MarketAnalyticsDTO(industryDistribution, volumeHistory));
    }

    @GetMapping("/admin/session")
    public ResponseEntity<MarketSession> getActiveSession() {
        return ResponseEntity.ok(marketSessionRepository.findByIsActiveTrue()
                .orElse(new MarketSession("StockConnect", "Main Platform")));
    }

    public record CompanyCreateRequest(String companyName, String tickerSymbol, BigDecimal currentPrice, Long totalShares) {}
}
