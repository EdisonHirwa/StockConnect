package com.stockconnect.dto;

import com.stockconnect.models.Trade;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record TradeDTO(
    UUID id,
    String tickerSymbol,
    String buyerName,
    String sellerName,
    BigDecimal executionPrice,
    Long executionQuantity,
    BigDecimal totalValue,
    LocalDateTime executedAt
) {
    public static TradeDTO from(Trade trade) {
        return new TradeDTO(
            trade.getId(),
            trade.getCompany().getTickerSymbol(),
            trade.getBuyOrder().getUser().getFullName(),
            trade.getSellOrder().getUser().getFullName(),
            trade.getExecutionPrice(),
            trade.getExecutionQuantity(),
            trade.getExecutionPrice().multiply(BigDecimal.valueOf(trade.getExecutionQuantity())),
            trade.getExecutedAt()
        );
    }
}
