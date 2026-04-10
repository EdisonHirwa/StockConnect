package com.stockconnect.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record LeaderboardDTO(
    UUID userId,
    String name,
    String initials,
    BigDecimal startingBalance,
    BigDecimal currentNetWorth,
    BigDecimal gainPercentage,
    Long tradesCount
) {}
