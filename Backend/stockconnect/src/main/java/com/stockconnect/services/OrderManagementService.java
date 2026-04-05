package com.stockconnect.services;

import com.stockconnect.models.*;
import com.stockconnect.repositories.OrderRepository;
import com.stockconnect.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class OrderManagementService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private WalletLedgerService walletLedgerService;

    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MatchingEngineService matchingEngineService;

    public List<Order> getUserOrders(UUID userId) {
        return orderRepository.findByUserId(userId);
    }

    @Transactional
    public Order placeBuyOrder(UUID userId, UUID companyId, Long quantity, BigDecimal price, OrderType type) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Company company = companyService.getCompanyById(companyId);

        if (type == OrderType.MARKET) {
            price = company.getCurrentPrice(); 
        }

        BigDecimal totalCost = price.multiply(BigDecimal.valueOf(quantity));
        walletLedgerService.lockFunds(userId, totalCost);

        Order order = new Order(user, company, OrderSide.BUY, type, price, quantity);
        Order savedOrder = orderRepository.save(order);

        // If it's a MARKET order, simulate an instant counter-party (System Market Maker)
        if (type == OrderType.MARKET) {
            User systemUser = userRepository.findByEmail("admin@stockconnect.com")
                                            .orElseThrow(() -> new RuntimeException("System Market Maker not found"));
            
            // Create counter sell order
            Order systemSell = new Order(systemUser, company, OrderSide.SELL, OrderType.MARKET, price, quantity);
            systemSell = orderRepository.save(systemSell);
            
            // Ensure system has enough locked shares so portfolio service doesn't complain during deduction
            portfolioService.addShares(systemUser.getId(), company, quantity, price);
            portfolioService.lockShares(systemUser.getId(), company.getId(), quantity);
        }

        matchingEngineService.matchOrders(companyId);

        return savedOrder;
    }

    @Transactional
    public Order placeSellOrder(UUID userId, UUID companyId, Long quantity, BigDecimal price, OrderType type) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Company company = companyService.getCompanyById(companyId);

        // Lock shares safely instead of removing them immediately
        portfolioService.lockShares(userId, companyId, quantity);

        if (type == OrderType.MARKET) {
            price = company.getCurrentPrice();
        }

        Order order = new Order(user, company, OrderSide.SELL, type, price, quantity);
        Order savedOrder = orderRepository.save(order);

        // If it's a MARKET order, simulate an instant counter-party (System Market Maker)
        if (type == OrderType.MARKET) {
            User systemUser = userRepository.findByEmail("admin@stockconnect.com")
                                            .orElseThrow(() -> new RuntimeException("System Market Maker not found"));
            
            // Create counter buy order
            Order systemBuy = new Order(systemUser, company, OrderSide.BUY, OrderType.MARKET, price, quantity);
            systemBuy = orderRepository.save(systemBuy);
            
            // Ensure system has enough locked funds so wallet ledger service doesn't complain during deduction
            BigDecimal totalCost = price.multiply(BigDecimal.valueOf(quantity));
            walletLedgerService.deposit(systemUser.getId(), totalCost, "System Liquidity Deposit", null);
            walletLedgerService.lockFunds(systemUser.getId(), totalCost);
        }

        matchingEngineService.matchOrders(companyId);

        return savedOrder;
    }

    @Transactional
    public void cancelOrder(UUID orderId, UUID userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to cancel this order");
        }

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.PARTIAL) {
            throw new RuntimeException("Only pending or partially filled orders can be cancelled");
        }

        order.setStatus(OrderStatus.CANCELLED);

        Long remainingQuantity = order.getTotalQuantity() - order.getFilledQuantity();

        // Release locked assets based on what was NOT filled yet
        if (order.getSide() == OrderSide.BUY) {
            BigDecimal remainingRefund = order.getTargetPrice().multiply(BigDecimal.valueOf(remainingQuantity));
            walletLedgerService.unlockFunds(userId, remainingRefund);
        } else if (order.getSide() == OrderSide.SELL) {
            portfolioService.unlockShares(userId, order.getCompany().getId(), remainingQuantity);
        }

        orderRepository.save(order);
    }
}
