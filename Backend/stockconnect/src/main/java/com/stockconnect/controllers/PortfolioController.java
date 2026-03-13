package com.stockconnect.controllers;

import com.stockconnect.models.PortfolioHolding;
import com.stockconnect.models.User;
import com.stockconnect.services.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @GetMapping
    public ResponseEntity<List<PortfolioHolding>> getMyPortfolio(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(portfolioService.getPortfolio(user.getId()));
    }
}
