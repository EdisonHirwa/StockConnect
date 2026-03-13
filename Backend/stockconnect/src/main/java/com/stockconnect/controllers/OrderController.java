package com.stockconnect.controllers;

import com.stockconnect.models.Order;
import com.stockconnect.models.OrderType;
import com.stockconnect.models.User;
import com.stockconnect.services.OrderManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderManagementService orderManagementService;

    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(orderManagementService.getUserOrders(user.getId()));
    }

    @PostMapping("/buy")
    public ResponseEntity<Order> placeBuyOrder(@RequestBody OrderRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Order order = orderManagementService.placeBuyOrder(user.getId(), request.companyId(), request.quantity(), request.targetPrice(), request.type());
        return ResponseEntity.ok(order);
    }

    @PostMapping("/sell")
    public ResponseEntity<Order> placeSellOrder(@RequestBody OrderRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Order order = orderManagementService.placeSellOrder(user.getId(), request.companyId(), request.quantity(), request.targetPrice(), request.type());
        return ResponseEntity.ok(order);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelOrder(@PathVariable UUID id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        orderManagementService.cancelOrder(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    public record OrderRequest(UUID companyId, Long quantity, BigDecimal targetPrice, OrderType type) {}
}
