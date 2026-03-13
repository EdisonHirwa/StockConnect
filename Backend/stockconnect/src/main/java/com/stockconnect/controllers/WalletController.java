package com.stockconnect.controllers;

import com.stockconnect.models.User;
import com.stockconnect.models.Wallet;
import com.stockconnect.services.WalletLedgerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    @Autowired
    private WalletLedgerService walletLedgerService;

    @GetMapping
    public ResponseEntity<Wallet> getWallet(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(walletLedgerService.getWalletByUserId(user.getId()));
    }

    @PostMapping("/deposit")
    public ResponseEntity<Wallet> deposit(@RequestBody AmountRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(walletLedgerService.deposit(user.getId(), request.amount(), "Manual Deposit", null));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<Wallet> withdraw(@RequestBody AmountRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(walletLedgerService.withdraw(user.getId(), request.amount(), "Manual Withdrawal", null));
    }

    public record AmountRequest(BigDecimal amount) {}
}
