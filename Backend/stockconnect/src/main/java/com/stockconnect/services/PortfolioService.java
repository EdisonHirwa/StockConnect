package com.stockconnect.services;

import com.stockconnect.models.Company;
import com.stockconnect.models.PortfolioHolding;
import com.stockconnect.models.User;
import com.stockconnect.repositories.PortfolioHoldingRepository;
import com.stockconnect.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioHoldingRepository portfolioHoldingRepository;

    @Autowired
    private UserRepository userRepository;

    public List<PortfolioHolding> getPortfolio(UUID userId) {
        return portfolioHoldingRepository.findByUserId(userId);
    }

    public PortfolioHolding getHolding(UUID userId, UUID companyId) {
        return portfolioHoldingRepository.findByUserIdAndCompanyId(userId, companyId)
                .orElse(null);
    }

    @Transactional
    public void addShares(UUID userId, Company company, Long quantity, BigDecimal tradePrice) {
        PortfolioHolding holding = getHolding(userId, company.getId());
        if (holding == null) {
            User user = userRepository.findById(userId).orElseThrow();
            holding = new PortfolioHolding(user, company, quantity, tradePrice);
        } else {
            // Calculate new average price
            BigDecimal currentTotalValue = holding.getAverageBuyPrice().multiply(BigDecimal.valueOf(holding.getQuantity()));
            BigDecimal newTradeValue = tradePrice.multiply(BigDecimal.valueOf(quantity));
            Long totalQuantity = holding.getQuantity() + quantity;
            BigDecimal newAvgPrice = currentTotalValue.add(newTradeValue).divide(BigDecimal.valueOf(totalQuantity), 2, RoundingMode.HALF_UP);

            holding.setQuantity(totalQuantity);
            holding.setAverageBuyPrice(newAvgPrice);
        }
        portfolioHoldingRepository.save(holding);
    }

    @Transactional
    public void lockShares(UUID userId, UUID companyId, Long quantity) {
        PortfolioHolding holding = getHolding(userId, companyId);
        if (holding == null || (holding.getQuantity() - holding.getLockedQuantity()) < quantity) {
            throw new RuntimeException("Insufficient available shares to lock");
        }
        holding.setLockedQuantity(holding.getLockedQuantity() + quantity);
        portfolioHoldingRepository.save(holding);
    }

    @Transactional
    public void unlockShares(UUID userId, UUID companyId, Long quantity) {
        PortfolioHolding holding = getHolding(userId, companyId);
        holding.setLockedQuantity(holding.getLockedQuantity() - quantity);
        portfolioHoldingRepository.save(holding);
    }

    @Transactional
    public void deductLockedShares(UUID userId, UUID companyId, Long quantity) {
        PortfolioHolding holding = getHolding(userId, companyId);
        holding.setLockedQuantity(holding.getLockedQuantity() - quantity);
        holding.setQuantity(holding.getQuantity() - quantity);
        portfolioHoldingRepository.save(holding);
    }
}
