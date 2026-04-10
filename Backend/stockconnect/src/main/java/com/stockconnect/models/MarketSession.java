package com.stockconnect.models;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "market_sessions")
public class MarketSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String institutionName; // e.g. "RP Karongi"

    @Column(nullable = false)
    private String academicPeriod; // e.g. "Semester 1"

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    public MarketSession() {}

    public MarketSession(String institutionName, String academicPeriod) {
        this.institutionName = institutionName;
        this.academicPeriod = academicPeriod;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getInstitutionName() { return institutionName; }
    public void setInstitutionName(String name) { this.institutionName = name; }

    public String getAcademicPeriod() { return academicPeriod; }
    public void setAcademicPeriod(String period) { this.academicPeriod = period; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}
