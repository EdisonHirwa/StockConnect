package com.stockconnect.dto;

import com.stockconnect.models.PortfolioHolding;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Safe JSON representation of a PortfolioHolding.
 * Flattens the nested User and Company entities to prevent Jackson
 * circular-reference / UserDetails serialisation errors.
 */
public record PortfolioHoldingDTO(
        UUID id,
        UUID companyId,
        String companyName,
        String tickerSymbol,
        BigDecimal currentPrice,
        Long quantity,
        Long lockedQuantity,
        BigDecimal averageBuyPrice,
        BigDecimal totalValue,
        BigDecimal unrealizedPnl,
        LocalDateTime updatedAt
) {
    public static PortfolioHoldingDTO from(PortfolioHolding h) {
        BigDecimal currentPrice = h.getCompany().getCurrentPrice();
        BigDecimal qty          = BigDecimal.valueOf(h.getQuantity());
        BigDecimal totalValue   = currentPrice.multiply(qty);
        BigDecimal costBasis    = h.getAverageBuyPrice().multiply(qty);
        BigDecimal unrealizedPnl = totalValue.subtract(costBasis);

        return new PortfolioHoldingDTO(
                h.getId(),
                h.getCompany().getId(),
                h.getCompany().getCompanyName(),
                h.getCompany().getTickerSymbol(),
                currentPrice,
                h.getQuantity(),
                h.getLockedQuantity(),
                h.getAverageBuyPrice(),
                totalValue,
                unrealizedPnl,
                h.getUpdatedAt()
        );
    }
}
