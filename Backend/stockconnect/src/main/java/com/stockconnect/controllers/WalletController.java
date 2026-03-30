package com.stockconnect.controllers;

import com.stockconnect.dto.LedgerTransactionDTO;
import com.stockconnect.dto.WalletDTO;
import com.stockconnect.models.LedgerTransaction;
import com.stockconnect.models.User;
import com.stockconnect.models.Wallet;
import com.stockconnect.repositories.LedgerTransactionRepository;
import com.stockconnect.services.WalletLedgerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    @Autowired
    private WalletLedgerService walletLedgerService;

    @Autowired
    private LedgerTransactionRepository ledgerTransactionRepository;

    /** GET /api/wallet — returns the authenticated user's wallet as a safe DTO */
    @GetMapping
    public ResponseEntity<WalletDTO> getWallet(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Wallet wallet = walletLedgerService.getWalletByUserId(user.getId());
        return ResponseEntity.ok(WalletDTO.from(wallet));
    }

    /** GET /api/wallet/transactions — returns the full ledger history as safe DTOs */
    @GetMapping("/transactions")
    public ResponseEntity<List<LedgerTransactionDTO>> getTransactions(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Wallet wallet = walletLedgerService.getWalletByUserId(user.getId());
        List<LedgerTransactionDTO> dtos = ledgerTransactionRepository
                .findByWalletIdOrderByCreatedAtDesc(wallet.getId())
                .stream()
                .map(LedgerTransactionDTO::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /** POST /api/wallet/deposit */
    @PostMapping("/deposit")
    public ResponseEntity<WalletDTO> deposit(@RequestBody AmountRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Wallet wallet = walletLedgerService.deposit(user.getId(), request.amount(), "Manual Deposit", null);
        return ResponseEntity.ok(WalletDTO.from(wallet));
    }

    /** POST /api/wallet/withdraw */
    @PostMapping("/withdraw")
    public ResponseEntity<WalletDTO> withdraw(@RequestBody AmountRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Wallet wallet = walletLedgerService.withdraw(user.getId(), request.amount(), "Manual Withdrawal", null);
        return ResponseEntity.ok(WalletDTO.from(wallet));
    }

    public record AmountRequest(BigDecimal amount) {}
}
