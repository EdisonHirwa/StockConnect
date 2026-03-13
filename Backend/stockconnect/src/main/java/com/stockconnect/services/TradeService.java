package com.stockconnect.services;

import com.stockconnect.models.Company;
import com.stockconnect.models.Order;
import com.stockconnect.models.Trade;
import com.stockconnect.repositories.TradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class TradeService {

    @Autowired
    private TradeRepository tradeRepository;

    public List<Trade> getTradesByCompany(UUID companyId) {
        return tradeRepository.findByCompanyIdOrderByExecutedAtDesc(companyId);
    }

    public List<Trade> getUserTrades(UUID userId) {
        return tradeRepository.findByBuyOrderUserIdOrSellOrderUserIdOrderByExecutedAtDesc(userId, userId);
    }

    @Transactional
    public Trade recordTrade(Order buyOrder, Order sellOrder, Company company, Long executionQuantity, BigDecimal executionPrice) {
        Trade trade = new Trade(company, buyOrder, sellOrder, executionPrice, executionQuantity);
        return tradeRepository.save(trade);
    }
}
