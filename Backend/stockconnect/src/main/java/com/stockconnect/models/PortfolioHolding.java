package com.stockconnect.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "portfolio_holdings", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "company_id"})
})
public class PortfolioHolding {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    private Long quantity = 0L;

    @Column(name = "locked_quantity", nullable = false)
    private Long lockedQuantity = 0L;

    @Column(name = "average_buy_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal averageBuyPrice = BigDecimal.ZERO;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public PortfolioHolding() {}

    public PortfolioHolding(User user, Company company, Long quantity, BigDecimal averageBuyPrice) {
        this.user = user;
        this.company = company;
        this.quantity = quantity;
        this.averageBuyPrice = averageBuyPrice;
    }

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public Long getQuantity() { return quantity; }
    public void setQuantity(Long quantity) { this.quantity = quantity; }

    public Long getLockedQuantity() { return lockedQuantity; }
    public void setLockedQuantity(Long lockedQuantity) { this.lockedQuantity = lockedQuantity; }

    public BigDecimal getAverageBuyPrice() { return averageBuyPrice; }
    public void setAverageBuyPrice(BigDecimal averageBuyPrice) { this.averageBuyPrice = averageBuyPrice; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
