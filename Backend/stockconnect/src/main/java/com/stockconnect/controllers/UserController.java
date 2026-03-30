package com.stockconnect.controllers;

import com.stockconnect.models.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    /** GET /api/users/me — returns the authenticated user's full profile */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMe(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Map<String, Object> profile = new java.util.LinkedHashMap<>();
        profile.put("userId",      user.getId().toString());
        profile.put("fullName",    user.getFullName());
        profile.put("email",       user.getEmail());
        profile.put("phoneNumber", user.getPhoneNumber() != null ? user.getPhoneNumber() : "");
        profile.put("role",        user.getRole().name());
        profile.put("createdAt",   user.getCreatedAt() != null ? user.getCreatedAt().toString() : "");
        return ResponseEntity.ok(profile);
    }
}
