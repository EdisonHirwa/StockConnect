package com.stockconnect.repositories;

import com.stockconnect.models.PortfolioHolding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PortfolioHoldingRepository extends JpaRepository<PortfolioHolding, UUID> {
    List<PortfolioHolding> findByUserId(UUID userId);
    Optional<PortfolioHolding> findByUserIdAndCompanyId(UUID userId, UUID companyId);
}
