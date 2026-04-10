package com.stockconnect.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record MarketAnalyticsDTO(
    Map<String, Long> industryDistribution,
    List<VolumeDataPoint> volumeHistory
) {
    public record VolumeDataPoint(String date, BigDecimal buyVolume, BigDecimal sellVolume) {}
}
