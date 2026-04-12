package com.stockconnect.services;

import com.stockconnect.models.*;
import com.stockconnect.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class MatchingEngineService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private TradeService tradeService;

    @Autowired
    private WalletLedgerService walletLedgerService;

    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private AuditLogService auditLogService;

    @Transactional
    public void matchOrders(UUID companyId) {
        List<Order> buyOrders = orderRepository.findByCompanyIdAndSideAndStatusOrderByTargetPriceDescCreatedAtAsc(companyId, OrderSide.BUY, OrderStatus.PENDING);
        List<Order> sellOrders = orderRepository.findByCompanyIdAndSideAndStatusOrderByTargetPriceAscCreatedAtAsc(companyId, OrderSide.SELL, OrderStatus.PENDING);

        int buyIdx = 0;
        int sellIdx = 0;

        while (buyIdx < buyOrders.size() && sellIdx < sellOrders.size()) {
            Order buyOrder = buyOrders.get(buyIdx);
            Order sellOrder = sellOrders.get(sellIdx);

            if (buyOrder.getTargetPrice() != null && sellOrder.getTargetPrice() != null && buyOrder.getTargetPrice().compareTo(sellOrder.getTargetPrice()) >= 0) {
                // We have a match! Match price is decided by the maker (the older order).
                BigDecimal matchPrice = sellOrder.getCreatedAt().isBefore(buyOrder.getCreatedAt()) ? sellOrder.getTargetPrice() : buyOrder.getTargetPrice();
                
                Long remainingBuyQty = buyOrder.getTotalQuantity() - buyOrder.getFilledQuantity();
                Long remainingSellQty = sellOrder.getTotalQuantity() - sellOrder.getFilledQuantity();
                Long matchQuantity = Math.min(remainingBuyQty, remainingSellQty);

                // Execute trade
                executeTrade(buyOrder, sellOrder, matchQuantity, matchPrice);

                // Update orders
                buyOrder.setFilledQuantity(buyOrder.getFilledQuantity() + matchQuantity);
                sellOrder.setFilledQuantity(sellOrder.getFilledQuantity() + matchQuantity);

                buyOrder.setStatus(buyOrder.getFilledQuantity().equals(buyOrder.getTotalQuantity()) ? OrderStatus.FILLED : OrderStatus.PARTIAL);
                sellOrder.setStatus(sellOrder.getFilledQuantity().equals(sellOrder.getTotalQuantity()) ? OrderStatus.FILLED : OrderStatus.PARTIAL);

                if (buyOrder.getStatus() == OrderStatus.FILLED) buyIdx++;
                if (sellOrder.getStatus() == OrderStatus.FILLED) sellIdx++;

                orderRepository.save(buyOrder);
                orderRepository.save(sellOrder);
                
                // Update current market price of the company
                companyService.updateCompanyPrice(companyId, matchPrice);

            } else {
                // Highest buy is lower than lowest sell, no more matches possible
                break;
            }
        }
    }

    private void executeTrade(Order buyOrder, Order sellOrder, Long quantity, BigDecimal price) {
        Company company = buyOrder.getCompany();

        // 1. Record Trade
        Trade trade = tradeService.recordTrade(buyOrder, sellOrder, company, quantity, price);

        // 2. Calculate actual trade total
        BigDecimal totalTradeValue = price.multiply(BigDecimal.valueOf(quantity));

        // 3. Process Buyer Side: We previously locked funds at the expected target price.
        BigDecimal expectedTradeValue = buyOrder.getTargetPrice().multiply(BigDecimal.valueOf(quantity));
        BigDecimal refundAmount = expectedTradeValue.subtract(totalTradeValue);

        // Deduct the exact money that execution cost from the locked balance.
        walletLedgerService.deductLockedFunds(buyOrder.getUser().getId(), totalTradeValue, TransactionType.TRADE_BUY, trade.getId(), "Bought " + quantity + " shares of " + company.getTickerSymbol());

        if (refundAmount.compareTo(BigDecimal.ZERO) > 0) {
            // Unlock the surplus since they bought it cheaper than expected
            walletLedgerService.unlockFunds(buyOrder.getUser().getId(), refundAmount); 
        }

        // Give Buyer Shares
        portfolioService.addShares(buyOrder.getUser().getId(), company, quantity, price);


        // 4. Process Seller Side: They have locked portfolio shares
        // Deduct locked shares and credit their wallet
        portfolioService.deductLockedShares(sellOrder.getUser().getId(), company.getId(), quantity);
        walletLedgerService.addTradeProceeds(sellOrder.getUser().getId(), totalTradeValue, "Sold " + quantity + " shares of " + company.getTickerSymbol(), trade.getId());

        // Log trade execution for both parties
        auditLogService.log(buyOrder.getUser().getEmail(), "TRADE_EXECUTE", "Buy " + company.getTickerSymbol() + " Qty:" + quantity, "System", "bg-emerald-500/10 text-emerald-500 border-emerald-500/20");
        auditLogService.log(sellOrder.getUser().getEmail(), "TRADE_EXECUTE", "Sell " + company.getTickerSymbol() + " Qty:" + quantity, "System", "bg-emerald-500/10 text-emerald-500 border-emerald-500/20");
    }
}
