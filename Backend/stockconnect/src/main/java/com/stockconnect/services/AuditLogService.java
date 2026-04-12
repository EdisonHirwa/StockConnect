package com.stockconnect.services;

import com.stockconnect.models.AuditLog;
import com.stockconnect.repositories.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void log(String action, String target, String statusColor) {
        String userEmail = "anonymous";
        String ipAddress = "0.0.0.0";

        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                userEmail = auth.getName();
            }

            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                ipAddress = request.getRemoteAddr();
                // Handle proxies
                String xForwardedFor = request.getHeader("X-Forwarded-For");
                if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                    ipAddress = xForwardedFor.split(",")[0];
                }
            }
        } catch (Exception e) {
            // Fallback or ignore
        }

        AuditLog log = new AuditLog(userEmail, action, target, ipAddress, statusColor);
        auditLogRepository.save(log);
    }

    public void log(String userEmail, String action, String target, String ipAddress, String statusColor) {
        AuditLog log = new AuditLog(userEmail, action, target, ipAddress, statusColor);
        auditLogRepository.save(log);
    }
}
