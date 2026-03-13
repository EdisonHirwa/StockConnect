package com.stockconnect.repositories;

import com.stockconnect.models.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TradeRepository extends JpaRepository<Trade, UUID> {
    List<Trade> findByCompanyIdOrderByExecutedAtDesc(UUID companyId);
    List<Trade> findByBuyOrderUserIdOrSellOrderUserIdOrderByExecutedAtDesc(UUID buyUserId, UUID sellUserId);
}
