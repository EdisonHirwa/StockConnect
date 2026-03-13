package com.stockconnect.repositories;

import com.stockconnect.models.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CompanyRepository extends JpaRepository<Company, UUID> {
    Optional<Company> findByTickerSymbol(String tickerSymbol);
    boolean existsByTickerSymbol(String tickerSymbol);
    boolean existsByCompanyName(String companyName);
}
