package com.stockconnect.services;

import com.stockconnect.models.Company;
import com.stockconnect.repositories.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Company getCompanyById(UUID id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
    }

    @Transactional
    public Company createCompany(String companyName, String tickerSymbol, BigDecimal currentPrice, Long totalShares) {
        if (companyRepository.existsByTickerSymbol(tickerSymbol)) {
            throw new RuntimeException("Company with ticker symbol " + tickerSymbol + " already exists.");
        }
        if (companyRepository.existsByCompanyName(companyName)) {
            throw new RuntimeException("Company with name " + companyName + " already exists.");
        }

        Company company = new Company();
        company.setCompanyName(companyName);
        company.setTickerSymbol(tickerSymbol);
        company.setCurrentPrice(currentPrice);
        company.setTotalShares(totalShares);

        return companyRepository.save(company);
    }

    @Transactional
    public Company updateCompanyPrice(UUID companyId, BigDecimal newPrice) {
        Company company = getCompanyById(companyId);
        company.setCurrentPrice(newPrice);
        return companyRepository.save(company);
    }
}
