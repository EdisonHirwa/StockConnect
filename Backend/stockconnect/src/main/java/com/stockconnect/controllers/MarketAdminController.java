package com.stockconnect.controllers;

import com.stockconnect.models.Company;
import com.stockconnect.services.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class MarketAdminController {

    @Autowired
    private CompanyService companyService;

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

    public record CompanyCreateRequest(String companyName, String tickerSymbol, BigDecimal currentPrice, Long totalShares) {}
}
