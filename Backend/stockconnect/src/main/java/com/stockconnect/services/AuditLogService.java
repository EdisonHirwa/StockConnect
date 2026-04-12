package com.stockconnect.services;

import com.stockconnect.models.AuditLog;
import com.stockconnect.repositories.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    public void log(String userEmail, String action, String target, String ipAddress, String statusColor) {
        AuditLog log = new AuditLog(userEmail, action, target, ipAddress, statusColor);
        auditLogRepository.save(log);
    }
}
