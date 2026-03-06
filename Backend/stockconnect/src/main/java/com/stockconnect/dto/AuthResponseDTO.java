package com.stockconnect.dto;

public class AuthResponseDTO {

    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private long expiresIn;
    private String userId;
    private String role;

    public AuthResponseDTO() {}

    public AuthResponseDTO(String accessToken, String refreshToken,
                           String tokenType, long expiresIn,
                           String userId, String role) {
        this.accessToken  = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType    = tokenType;
        this.expiresIn    = expiresIn;
        this.userId       = userId;
        this.role         = role;
    }

    // ── Builder ───────────────────────────────────────────────────────────────

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String accessToken;
        private String refreshToken;
        private String tokenType = "Bearer";
        private long expiresIn;
        private String userId;
        private String role;

        public Builder accessToken(String v)  { this.accessToken = v; return this; }
        public Builder refreshToken(String v) { this.refreshToken = v; return this; }
        public Builder tokenType(String v)    { this.tokenType = v; return this; }
        public Builder expiresIn(long v)      { this.expiresIn = v; return this; }
        public Builder userId(String v)       { this.userId = v; return this; }
        public Builder role(String v)         { this.role = v; return this; }

        public AuthResponseDTO build() {
            return new AuthResponseDTO(accessToken, refreshToken, tokenType, expiresIn, userId, role);
        }
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public String getAccessToken()               { return accessToken; }
    public void setAccessToken(String v)         { this.accessToken = v; }
    public String getRefreshToken()              { return refreshToken; }
    public void setRefreshToken(String v)        { this.refreshToken = v; }
    public String getTokenType()                 { return tokenType; }
    public void setTokenType(String v)           { this.tokenType = v; }
    public long getExpiresIn()                   { return expiresIn; }
    public void setExpiresIn(long v)             { this.expiresIn = v; }
    public String getUserId()                    { return userId; }
    public void setUserId(String v)              { this.userId = v; }
    public String getRole()                      { return role; }
    public void setRole(String v)                { this.role = v; }
}
