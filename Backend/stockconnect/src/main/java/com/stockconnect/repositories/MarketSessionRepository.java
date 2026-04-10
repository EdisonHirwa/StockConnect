package com.stockconnect.repositories;

import com.stockconnect.models.MarketSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MarketSessionRepository extends JpaRepository<MarketSession, UUID> {
    Optional<MarketSession> findByIsActiveTrue();
}
