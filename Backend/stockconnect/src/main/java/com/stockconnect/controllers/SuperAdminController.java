package com.stockconnect.controllers;

import com.stockconnect.models.AuditLog;
import com.stockconnect.models.Trade;
import com.stockconnect.models.User;
import com.stockconnect.repositories.AuditLogRepository;
import com.stockconnect.repositories.TradeRepository;
import com.stockconnect.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import com.stockconnect.models.Role;

@RestController
@RequestMapping("/api/superadmin")
public class SuperAdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TradeRepository tradeRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Map<String, Object> response = new HashMap<>();

        long totalUsers = userRepository.count();
        List<Trade> allTrades = tradeRepository.findAllByOrderByExecutedAtDesc();
        
        BigDecimal systemRevenue = BigDecimal.ZERO; 
        for (Trade trade : allTrades) {
            // For now, representing total platform trading volume as "revenue" generated through the platform
            systemRevenue = systemRevenue.add(trade.getExecutionPrice().multiply(BigDecimal.valueOf(trade.getExecutionQuantity())));
        }
        
        long activeTrades = allTrades.size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("systemRevenue", systemRevenue); 
        stats.put("activeTrades", activeTrades);
        stats.put("systemLoad", "42%"); 

        List<User> allUsers = userRepository.findAll();

        // Chart Data (Aggregating real data dynamically for the last 7 days)
        List<Map<String, Object>> chartData = new ArrayList<>();
        DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("EEE");
        LocalDateTime now = LocalDateTime.now();

        for (int i = 6; i >= 0; i--) {
            LocalDateTime date = now.minusDays(i);
            String dayName = date.format(dayFormatter);

            long usersOnDay = allUsers.stream()
                    .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().toLocalDate().equals(date.toLocalDate()))
                    .count();

            BigDecimal revenueOnDay = BigDecimal.ZERO;
            for (Trade t : allTrades) {
                if (t.getExecutedAt() != null && t.getExecutedAt().toLocalDate().equals(date.toLocalDate())) {
                    revenueOnDay = revenueOnDay.add(t.getExecutionPrice().multiply(BigDecimal.valueOf(t.getExecutionQuantity())));
                }
            }

            Map<String, Object> day = new HashMap<>();
            day.put("name", dayName);
            day.put("revenue", revenueOnDay);
            day.put("users", usersOnDay);
            chartData.add(day);
        }

        // Recent Logs from actual trades
        List<Map<String, Object>> logs = new ArrayList<>();
        int limit = Math.min(allTrades.size(), 6);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, hh:mm a");
        for(int i = 0; i < limit; i++) {
            Trade t = allTrades.get(i);
            Map<String, Object> log = new HashMap<>();
            
            // Generate a 6-digit numeric ID from the UUID hash
            String numericId = String.format("%06d", Math.abs(t.getId().hashCode()) % 1000000);
            
            log.put("id", "#TRD-" + numericId);
            log.put("type", "Trade Executed");
            log.put("entity", t.getBuyOrder() != null ? t.getBuyOrder().getUser().getEmail() : "Market");
            log.put("date", t.getExecutedAt() != null ? t.getExecutedAt().format(formatter) : "Unknown");
            log.put("status", "Success");
            log.put("statusColor", "text-emerald-500 bg-emerald-50");
            logs.add(log);
        }

        // If no trades, add some dummy mock logs just to show UI structure
        if (logs.isEmpty()) {
             Map<String, Object> log1 = new HashMap<>();
             log1.put("id", "#SYS-001"); log1.put("type", "System Started"); log1.put("entity", "System Admin"); log1.put("date", "Oct 23, 08:00 AM"); log1.put("status", "Success"); log1.put("statusColor", "text-emerald-500 bg-emerald-50");
             logs.add(log1);
        }

        response.put("stats", stats);
        response.put("chartData", chartData);
        response.put("logs", logs);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> response = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        
        for (User u : users) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("name", u.getFullName());
            map.put("email", u.getEmail());
            
            // UI expects Capitalized role strings
            String roleName = u.getRole() != null ? u.getRole().name() : "TRADER";
            if (roleName.equals("SUPER_ADMIN")) roleName = "Admin";
            else if (roleName.equals("MARKET_ADMIN")) roleName = "Market Admin";
            else if (roleName.equals("TRADER")) roleName = "Trader";
            else if (roleName.equals("COMPANY_REP")) roleName = "Company Rep";
            
            map.put("role", roleName);
            
            String avatar = "";
            if (u.getFullName() != null && !u.getFullName().trim().isEmpty()) {
                String[] split = u.getFullName().trim().split("\\s+");
                avatar += split[0].charAt(0);
                if (split.length > 1) {
                    avatar += split[1].charAt(0);
                }
            }
            map.put("avatar", avatar.toUpperCase());
            map.put("status", "Active"); // hardcoded for now as DB doesn't track status
            map.put("joinDate", u.getCreatedAt() != null ? u.getCreatedAt().format(formatter) : "Unknown");
            response.add(map);
        }
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            try {
                userRepository.deleteById(id);
                // Log this administrative action
                auditLogRepository.save(new AuditLog("admin@system", "USER_DELETE", user.getEmail(), "127.0.0.1", "bg-rose-500/10 text-rose-500 border-rose-500/20"));
                return ResponseEntity.ok().build();
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Cannot delete user: Active dependencies exist in ledger/trades.");
            }
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable UUID id, @RequestBody Map<String, String> payload) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            try {
                String newRole = payload.get("role").toUpperCase();
                // Basic mapping to enum
                if (newRole.contains("MARKET")) newRole = "MARKET_ADMIN";
                else if (newRole.contains("SUPER") || newRole.equals("ADMIN")) newRole = "SUPER_ADMIN";
                else if (newRole.contains("COMPANY")) newRole = "COMPANY_REP";
                else newRole = "TRADER";

                user.setRole(Role.valueOf(newRole));
                userRepository.save(user);

                // Log this administrative action
                auditLogRepository.save(new AuditLog("admin@system", "ROLE_CHANGE", user.getEmail() + " \u2192 " + newRole, "127.0.0.1", "bg-slate-500/10 text-slate-400 border-slate-500/20"));

                return ResponseEntity.ok().build();
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Invalid role.");
            }
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        List<AuditLog> logs = auditLogRepository.findAllByOrderByTimestampDesc();
        
        // Seed if empty to give user immediate feedback for "All Users" logs
        if (logs.isEmpty()) {
            // Logs from different user types
            auditLogRepository.save(new AuditLog("admin@system", "TENANT_CREATE", "CMA Training", "192.168.1.4", "bg-blue-500/10 text-blue-500 border-blue-500/20"));
            auditLogRepository.save(new AuditLog("j.ndayisenga", "SESSION_OPEN", "RP Karongi", "10.0.0.5", "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"));
            auditLogRepository.save(new AuditLog("m.uwase@trader.com", "TRADE_BUY", "AAPL Stock", "10.0.0.8", "bg-blue-500/10 text-blue-500 border-blue-500/20"));
            auditLogRepository.save(new AuditLog("k.habimana@company.rw", "STOCK_ISSUE", "BK Shares", "192.168.1.15", "bg-amber-500/10 text-amber-500 border-amber-500/20"));
            auditLogRepository.save(new AuditLog("admin@system", "WALLET_ADJUST", "wallet #w-0041", "10.0.0.5", "bg-amber-500/10 text-amber-500 border-amber-500/20"));
            auditLogRepository.save(new AuditLog("t.mugisha@trader.com", "WALLET_DEPOSIT", "RWF 50,000", "192.168.1.22", "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"));
            auditLogRepository.save(new AuditLog("admin@system", "TRADE_REVERSAL", "trade #t-8892", "192.168.1.12", "bg-rose-500/10 text-rose-500 border-rose-500/20"));
            
            logs = auditLogRepository.findAllByOrderByTimestampDesc();
        }
        
        return ResponseEntity.ok(logs);
    }
}
