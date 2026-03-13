package com.stockconnect.repositories;

import com.stockconnect.models.LedgerTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LedgerTransactionRepository extends JpaRepository<LedgerTransaction, UUID> {
    List<LedgerTransaction> findByWalletIdOrderByCreatedAtDesc(UUID walletId);
}
