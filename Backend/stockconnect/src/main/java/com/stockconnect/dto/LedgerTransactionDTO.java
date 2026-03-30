package com.stockconnect.dto;

import com.stockconnect.models.LedgerTransaction;
import com.stockconnect.models.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Safe JSON representation of a LedgerTransaction — strips the nested Wallet
 * (and its User) to prevent Jackson circular-reference serialisation errors.
 */
public record LedgerTransactionDTO(
        UUID id,
        UUID walletId,
        TransactionType type,
        BigDecimal amount,
        UUID referenceId,
        String description,
        LocalDateTime createdAt
) {
    public static LedgerTransactionDTO from(LedgerTransaction tx) {
        return new LedgerTransactionDTO(
                tx.getId(),
                tx.getWallet().getId(),
                tx.getType(),
                tx.getAmount(),
                tx.getReferenceId(),
                tx.getDescription(),
                tx.getCreatedAt()
        );
    }
}
