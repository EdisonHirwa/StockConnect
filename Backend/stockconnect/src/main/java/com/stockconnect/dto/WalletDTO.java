package com.stockconnect.dto;

import com.stockconnect.models.Wallet;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Safe JSON representation of a Wallet — excludes the nested User entity
 * to avoid Jackson circular-reference / UserDetails serialisation errors.
 */
public record WalletDTO(
        UUID id,
        UUID userId,
        String userEmail,
        BigDecimal balance,
        BigDecimal lockedBalance,
        LocalDateTime updatedAt
) {
    /** Convenience factory. */
    public static WalletDTO from(Wallet wallet) {
        return new WalletDTO(
                wallet.getId(),
                wallet.getUser().getId(),
                wallet.getUser().getEmail(),
                wallet.getBalance(),
                wallet.getLockedBalance(),
                wallet.getUpdatedAt()
        );
    }
}
