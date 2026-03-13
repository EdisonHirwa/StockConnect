package com.stockconnect.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "trades")
public class Trade {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne
    @JoinColumn(name = "buy_order_id", nullable = false)
    private Order buyOrder;

    @ManyToOne
    @JoinColumn(name = "sell_order_id", nullable = false)
    private Order sellOrder;

    @Column(name = "execution_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal executionPrice;

    @Column(name = "execution_quantity", nullable = false)
    private Long executionQuantity;

    @Column(name = "executed_at", updatable = false)
    private LocalDateTime executedAt;

    public Trade() {}

    public Trade(Company company, Order buyOrder, Order sellOrder, BigDecimal executionPrice, Long executionQuantity) {
        this.company = company;
        this.buyOrder = buyOrder;
        this.sellOrder = sellOrder;
        this.executionPrice = executionPrice;
        this.executionQuantity = executionQuantity;
    }

    @PrePersist
    protected void onCreate() {
        executedAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public Order getBuyOrder() { return buyOrder; }
    public void setBuyOrder(Order buyOrder) { this.buyOrder = buyOrder; }

    public Order getSellOrder() { return sellOrder; }
    public void setSellOrder(Order sellOrder) { this.sellOrder = sellOrder; }

    public BigDecimal getExecutionPrice() { return executionPrice; }
    public void setExecutionPrice(BigDecimal executionPrice) { this.executionPrice = executionPrice; }

    public Long getExecutionQuantity() { return executionQuantity; }
    public void setExecutionQuantity(Long executionQuantity) { this.executionQuantity = executionQuantity; }

    public LocalDateTime getExecutedAt() { return executedAt; }
    public void setExecutedAt(LocalDateTime executedAt) { this.executedAt = executedAt; }
}
