package com.stockconnect.models;

import jakarta.persistence.*;

@Entity
@Table(name = "system_settings")
public class SystemSettings {

    @Id
    private Long id = 1L; // Singleton row

    // ── General ──────────────────────────────────────────────────────────────
    @Column(name = "platform_name")
    private String platformName = "StockConnect";

    @Column(name = "support_email")
    private String supportEmail = "support@stockconnect.com";

    @Column(name = "tagline", length = 500)
    private String tagline = "Your gateway to global markets.";

    @Column(name = "currency")
    private String currency = "USD ($)";

    @Column(name = "timezone")
    private String timezone = "UTC (Coordinated Universal Time)";

    // ── Security ─────────────────────────────────────────────────────────────
    @Column(name = "require_2fa")
    private boolean require2fa = true;

    @Column(name = "session_timeout")
    private String sessionTimeout = "15 Minutes";

    // ── Notifications ─────────────────────────────────────────────────────────
    @Column(name = "notify_new_registrations")
    private boolean notifyNewRegistrations = true;

    @Column(name = "notify_large_deposits")
    private boolean notifyLargeDeposits = false;

    @Column(name = "notify_system_errors")
    private boolean notifySystemErrors = true;

    @Column(name = "notify_daily_reports")
    private boolean notifyDailyReports = false;

    public SystemSettings() {}

    // ── Getters & Setters ────────────────────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPlatformName() { return platformName; }
    public void setPlatformName(String platformName) { this.platformName = platformName; }

    public String getSupportEmail() { return supportEmail; }
    public void setSupportEmail(String supportEmail) { this.supportEmail = supportEmail; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public boolean isRequire2fa() { return require2fa; }
    public void setRequire2fa(boolean require2fa) { this.require2fa = require2fa; }

    public String getSessionTimeout() { return sessionTimeout; }
    public void setSessionTimeout(String sessionTimeout) { this.sessionTimeout = sessionTimeout; }

    public boolean isNotifyNewRegistrations() { return notifyNewRegistrations; }
    public void setNotifyNewRegistrations(boolean notifyNewRegistrations) { this.notifyNewRegistrations = notifyNewRegistrations; }

    public boolean isNotifyLargeDeposits() { return notifyLargeDeposits; }
    public void setNotifyLargeDeposits(boolean notifyLargeDeposits) { this.notifyLargeDeposits = notifyLargeDeposits; }

    public boolean isNotifySystemErrors() { return notifySystemErrors; }
    public void setNotifySystemErrors(boolean notifySystemErrors) { this.notifySystemErrors = notifySystemErrors; }

    public boolean isNotifyDailyReports() { return notifyDailyReports; }
    public void setNotifyDailyReports(boolean notifyDailyReports) { this.notifyDailyReports = notifyDailyReports; }
}
