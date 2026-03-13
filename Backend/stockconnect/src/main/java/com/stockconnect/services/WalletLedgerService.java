package com.stockconnect.services;

import com.stockconnect.models.LedgerTransaction;
import com.stockconnect.models.TransactionType;
import com.stockconnect.models.User;
import com.stockconnect.models.Wallet;
import com.stockconnect.repositories.LedgerTransactionRepository;
import com.stockconnect.repositories.UserRepository;
import com.stockconnect.repositories.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class WalletLedgerService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LedgerTransactionRepository ledgerTransactionRepository;

    public Wallet getWalletByUserId(UUID userId) {
        return walletRepository.findByUserId(userId)
                .orElseGet(() -> createEmptyWalletForUser(userId));
    }

    private Wallet createEmptyWalletForUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Wallet wallet = new Wallet(user, BigDecimal.ZERO);
        return walletRepository.save(wallet);
    }

    @Transactional
    public Wallet deposit(UUID userId, BigDecimal amount, String description, UUID referenceId) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Deposit amount must be greater than zero");
        }
        Wallet wallet = getWalletByUserId(userId);
        wallet.setBalance(wallet.getBalance().add(amount));
        Wallet savedWallet = walletRepository.save(wallet);

        createLedger(savedWallet, TransactionType.DEPOSIT, amount, referenceId, description);
        return savedWallet;
    }

    @Transactional
    public Wallet withdraw(UUID userId, BigDecimal amount, String description, UUID referenceId) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Withdrawal amount must be greater than zero");
        }
        Wallet wallet = getWalletByUserId(userId);
        if (getAvailableBalance(wallet).compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient available funds for withdrawal");
        }
        wallet.setBalance(wallet.getBalance().subtract(amount));
        Wallet savedWallet = walletRepository.save(wallet);

        createLedger(savedWallet, TransactionType.WITHDRAWAL, amount.negate(), referenceId, description);
        return savedWallet;
    }

    @Transactional
    public void lockFunds(UUID userId, BigDecimal amount) {
        Wallet wallet = getWalletByUserId(userId);
        if (getAvailableBalance(wallet).compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient available balance to lock");
        }
        wallet.setLockedBalance(wallet.getLockedBalance().add(amount));
        walletRepository.save(wallet);
    }

    @Transactional
    public void unlockFunds(UUID userId, BigDecimal amount) {
        Wallet wallet = getWalletByUserId(userId);
        wallet.setLockedBalance(wallet.getLockedBalance().subtract(amount));
        walletRepository.save(wallet);
    }

    @Transactional
    public void deductLockedFunds(UUID userId, BigDecimal amount, TransactionType type, UUID referenceId, String description) {
        Wallet wallet = getWalletByUserId(userId);
        wallet.setLockedBalance(wallet.getLockedBalance().subtract(amount));
        wallet.setBalance(wallet.getBalance().subtract(amount));
        Wallet savedWallet = walletRepository.save(wallet);

        createLedger(savedWallet, type, amount.negate(), referenceId, description);
    }

    public BigDecimal getAvailableBalance(Wallet wallet) {
        return wallet.getBalance().subtract(wallet.getLockedBalance());
    }

    private void createLedger(Wallet wallet, TransactionType type, BigDecimal amount, UUID referenceId, String description) {
        LedgerTransaction transaction = new LedgerTransaction(wallet, type, amount, referenceId, description);
        ledgerTransactionRepository.save(transaction);
    }
}
