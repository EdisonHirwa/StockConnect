package com.stockconnect.dto;

import com.stockconnect.models.Order;
import com.stockconnect.models.OrderSide;
import com.stockconnect.models.OrderStatus;
import com.stockconnect.models.OrderType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record OrderDTO(
        UUID id,
        UUID userId,
        UUID companyId,
        String companyName,
        String tickerSymbol,
        OrderSide side,
        OrderType type,
        BigDecimal targetPrice,
        Long totalQuantity,
        Long filledQuantity,
        OrderStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static OrderDTO from(Order order) {
        return new OrderDTO(
                order.getId(),
                order.getUser().getId(),
                order.getCompany().getId(),
                order.getCompany().getCompanyName(),
                order.getCompany().getTickerSymbol(),
                order.getSide(),
                order.getType(),
                order.getTargetPrice(),
                order.getTotalQuantity(),
                order.getFilledQuantity(),
                order.getStatus(),
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }
}
