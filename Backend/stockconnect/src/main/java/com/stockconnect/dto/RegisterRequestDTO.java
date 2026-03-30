package com.stockconnect.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RegisterRequestDTO {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Role is required")
    private String role;   // Accepted values: MARKET_ADMIN, TRADER, COMPANY_REP

    public RegisterRequestDTO() {}

    public String getFullName()               { return fullName; }
    public void setFullName(String fullName)  { this.fullName = fullName; }
    public String getEmail()                  { return email; }
    public void setEmail(String email)        { this.email = email; }
    public String getPhoneNumber()            { return phoneNumber; }
    public void setPhoneNumber(String p)      { this.phoneNumber = p; }
    public String getPassword()               { return password; }
    public void setPassword(String password)  { this.password = password; }
    public String getRole()                   { return role; }
    public void setRole(String role)          { this.role = role; }
}
