package com.stockconnect.controllers;

import com.stockconnect.dto.MarketStatsDTO;
import com.stockconnect.dto.OrderDTO;
import com.stockconnect.dto.TradeDTO;
import com.stockconnect.models.Company;
import com.stockconnect.models.Role;
import com.stockconnect.repositories.OrderRepository;
import com.stockconnect.repositories.TradeRepository;
import com.stockconnect.repositories.UserRepository;
import com.stockconnect.services.CompanyService;
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

    public record CompanyCreateRequest(String companyName, String tickerSymbol, BigDecimal currentPrice, Long totalShares) {}
}
