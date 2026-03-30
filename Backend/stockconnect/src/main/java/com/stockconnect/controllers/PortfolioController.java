package com.stockconnect.controllers;

import com.stockconnect.dto.PortfolioHoldingDTO;
import com.stockconnect.models.User;
import com.stockconnect.services.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    /** GET /api/portfolio — returns safe DTOs (no nested User/Company entities) */
    @GetMapping
    public ResponseEntity<List<PortfolioHoldingDTO>> getMyPortfolio(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<PortfolioHoldingDTO> dtos = portfolioService.getPortfolio(user.getId())
                .stream()
                .map(PortfolioHoldingDTO::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
