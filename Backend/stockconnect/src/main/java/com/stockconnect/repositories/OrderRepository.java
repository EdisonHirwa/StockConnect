package com.stockconnect.repositories;

import com.stockconnect.models.Order;
import com.stockconnect.models.OrderStatus;
import com.stockconnect.models.OrderSide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByUserId(UUID userId);
    
    // For Matching Engine: Find active SELL orders, sorted by lowest price first, then oldest first
    List<Order> findByCompanyIdAndSideAndStatusOrderByTargetPriceAscCreatedAtAsc(UUID companyId, OrderSide side, OrderStatus status);

    // For Matching Engine: Find active BUY orders, sorted by highest price first, then oldest first
    List<Order> findByCompanyIdAndSideAndStatusOrderByTargetPriceDescCreatedAtAsc(UUID companyId, OrderSide side, OrderStatus status);
}
