package com.stockconnect.dto;

import java.math.BigDecimal;

public record MarketStatsDTO(
    long activeTraders,
    long ordersToday,
    long tradesExecuted,
    BigDecimal totalVolumeRWF
) {}
