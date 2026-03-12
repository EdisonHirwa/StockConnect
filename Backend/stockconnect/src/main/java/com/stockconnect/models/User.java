package com.stockconnect.models;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // ── Constructors ─────────────────────────────────────────────────────────

    public User() {}

    public User(UUID id, String fullName, String email, String password, Role role, LocalDateTime createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
    }

    // ── Builder ──────────────────────────────────────────────────────────────

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private UUID id;
        private String fullName;
        private String email;
        private String password;
        private Role role;
        private LocalDateTime createdAt;

        public Builder id(UUID id)                    { this.id = id; return this; }
        public Builder fullName(String fullName)      { this.fullName = fullName; return this; }
        public Builder email(String email)            { this.email = email; return this; }
        public Builder password(String password)      { this.password = password; return this; }
        public Builder role(Role role)                { this.role = role; return this; }
        public Builder createdAt(LocalDateTime dt)    { this.createdAt = dt; return this; }

        public User build() {
            return new User(id, fullName, email, password, role, createdAt);
        }
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public UUID getId()                       { return id; }
    public void setId(UUID id)                { this.id = id; }
    public String getFullName()               { return fullName; }
    public void setFullName(String fullName)  { this.fullName = fullName; }
    public String getEmail()                  { return email; }
    public void setEmail(String email)        { this.email = email; }
    public Role getRole()                     { return role; }
    public void setRole(Role role)            { this.role = role; }
    public LocalDateTime getCreatedAt()       { return createdAt; }
    public void setCreatedAt(LocalDateTime dt){ this.createdAt = dt; }

    // ── UserDetails contract ──────────────────────────────────────────────────

    @Override
    public String getPassword()               { return password; }
    public void setPassword(String password)  { this.password = password; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername()               { return email; }

    @Override public boolean isAccountNonExpired()     { return true; }
    @Override public boolean isAccountNonLocked()      { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled()               { return true; }
}
