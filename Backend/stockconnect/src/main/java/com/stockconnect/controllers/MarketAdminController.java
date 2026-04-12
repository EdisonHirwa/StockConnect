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
import com.stockconnect.services.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
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

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping("/companies")
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @PostMapping("/admin/companies")
    public ResponseEntity<Company> createCompany(@RequestBody CompanyCreateRequest request) {
        Company company = companyService.createCompany(request.companyName(), request.tickerSymbol(), request.currentPrice(), request.totalShares());
        
        // Log company creation
        auditLogService.log("COMPANY_CREATE", company.getTickerSymbol(), "bg-emerald-500/10 text-emerald-500 border-emerald-500/20");
        
        return ResponseEntity.ok(company);
    }

    @PutMapping("/admin/companies/{id}/price")
    public ResponseEntity<Company> updatePrice(@PathVariable UUID id, @RequestParam BigDecimal newPrice) {
        Company company = companyService.updateCompanyPrice(id, newPrice);
        
        // Log price update
        auditLogService.log("PRICE_UPDATE", company.getTickerSymbol() + " -> " + newPrice, "bg-amber-500/10 text-amber-500 border-amber-500/20");
        
        return ResponseEntity.ok(company);
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
                    .filter(t -> t.getBuyOrder().getUser().getId().equals(user.getId()) || t.getSellOrder().getUser().getId().equals(user.getId()))
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
        MarketSession session = marketSessionRepository.findAll().stream().findFirst()
                .orElseGet(() -> marketSessionRepository.save(new MarketSession("StockConnect", "Main Platform")));
        return ResponseEntity.ok(session);
    }

    @PatchMapping("/admin/session/toggle")
    public ResponseEntity<MarketSession> toggleSessionStatus() {
        MarketSession session = marketSessionRepository.findAll().stream().findFirst()
            .orElseGet(() -> marketSessionRepository.save(new MarketSession("StockConnect", "Main Platform")));
        session.setActive(!session.isActive());
        MarketSession savedSession = marketSessionRepository.save(session);
        
        // Log session toggle
        auditLogService.log("SESSION_TOGGLE", savedSession.isActive() ? "OPEN" : "CLOSED", "bg-slate-500/10 text-slate-400 border-slate-500/20");
        
        return ResponseEntity.ok(savedSession);
    }

    @PutMapping("/admin/session/schedule")
    public ResponseEntity<MarketSession> updateSessionSchedule(@RequestBody SessionScheduleRequest request) {
        MarketSession session = marketSessionRepository.findAll().stream().findFirst()
            .orElseGet(() -> marketSessionRepository.save(new MarketSession("StockConnect", "Main Platform")));
        
        session.setOpenTime(request.openTime());
        session.setCloseTime(request.closeTime());
        session.setSessionDate(request.sessionDate());
        session.setAutoOpen(request.autoOpen());
        
        return ResponseEntity.ok(marketSessionRepository.save(session));
    }

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/admin/session/broadcast")
    public ResponseEntity<Map<String, String>> broadcastEvent(@RequestBody Map<String, String> payload) {
        messagingTemplate.convertAndSend("/topic/market-events", payload);
        return ResponseEntity.ok(Map.of("message", "Event broadcasted successfully"));
    }

    public record CompanyCreateRequest(String companyName, String tickerSymbol, BigDecimal currentPrice, Long totalShares) {}
    public record SessionScheduleRequest(LocalTime openTime, LocalTime closeTime, LocalDate sessionDate, boolean autoOpen) {}
}
