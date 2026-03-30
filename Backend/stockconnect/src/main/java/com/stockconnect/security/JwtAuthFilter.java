package com.stockconnect.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Date;

/**
 * Validates the JWT on every request.
 *
 * Sliding inactivity window:
 *   If the token is valid but has less than half its total lifetime remaining,
 *   a freshly-signed token (full 15 min) is issued and returned in the
 *   "X-Refreshed-Token" response header.  The frontend should read this header
 *   and replace the stored token so the 15-minute clock resets with activity.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthFilter(JwtService jwtService, CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);

        try {
            final String email = jwtService.extractEmail(jwt);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    // ── Authenticate ──────────────────────────────────────────
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    // ── Sliding inactivity window ─────────────────────────────
                    // If less than half of the token's lifetime remains, issue a
                    // fresh token so an active user is never logged out mid-session.
                    Date expiry       = jwtService.extractExpiration(jwt);
                    long remainingMs  = expiry.getTime() - System.currentTimeMillis();
                    long halfLifeMs   = jwtService.getAccessTokenExpMs() / 2; // 7.5 min

                    if (remainingMs < halfLifeMs) {
                        String refreshedToken = jwtService.generateAccessToken(
                                (com.stockconnect.models.User) userDetails);
                        // Expose the header so the browser JS can read it
                        response.setHeader("X-Refreshed-Token", refreshedToken);
                        response.setHeader("Access-Control-Expose-Headers", "X-Refreshed-Token");
                    }
                }
            }
        } catch (Exception ignored) {
            // Invalid / expired token — Spring Security returns 401 naturally
        }

        filterChain.doFilter(request, response);
    }
}
