package com.stockconnect.controllers;

import com.stockconnect.models.Trade;
import com.stockconnect.models.User;
import com.stockconnect.services.TradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trades")
public class TradeController {

    @Autowired
    private TradeService tradeService;

    @GetMapping("/market/{companyId}")
    public ResponseEntity<List<Trade>> getMarketTrades(@PathVariable UUID companyId) {
        return ResponseEntity.ok(tradeService.getTradesByCompany(companyId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Trade>> getMyTrades(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(tradeService.getUserTrades(user.getId()));
    }
}
