package com.stockconnect.exceptions;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ── Email Already Taken (409) ─────────────────────────────────────────────
    @ExceptionHandler(EmailAlreadyTakenException.class)
    public ResponseEntity<Map<String, Object>> handleEmailTaken(
            EmailAlreadyTakenException ex, HttpServletRequest request) {
        return buildError(HttpStatus.CONFLICT, "EMAIL_TAKEN", ex.getMessage(), request.getRequestURI());
    }

    // ── Bad Credentials (401) ────────────────────────────────────────────────
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(
            BadCredentialsException ex, HttpServletRequest request) {
        return buildError(HttpStatus.UNAUTHORIZED, "BAD_CREDENTIALS",
                "Invalid email or password.", request.getRequestURI());
    }

    // ── Validation Errors (400) ──────────────────────────────────────────────
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fe.getField(), fe.getDefaultMessage());
        }

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "VALIDATION_FAILED");
        body.put("errors", fieldErrors);
        body.put("path", request.getRequestURI());

        return ResponseEntity.badRequest().body(body);
    }

    // ── Duplicate Key / Unique Constraint (409) ──────────────────────────────
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrity(
            DataIntegrityViolationException ex, HttpServletRequest request) {

        String raw = ex.getMostSpecificCause().getMessage().toLowerCase();
        String friendly;

        if (raw.contains("phone_number")) {
            friendly = "This phone number is already registered. Please use a different number.";
        } else if (raw.contains("email")) {
            friendly = "This email address is already in use. Please log in or use a different email.";
        } else if (raw.contains("ticker_symbol") || raw.contains("ticker")) {
            friendly = "A company with this ticker symbol already exists.";
        } else {
            friendly = "This record already exists or violates a uniqueness rule. Please check your input.";
        }

        return buildError(HttpStatus.CONFLICT, "DUPLICATE_ENTRY", friendly, request.getRequestURI());
    }

    // ── Generic 500 fallback ─────────────────────────────────────────────────
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(
            Exception ex, HttpServletRequest request) {
        // Never expose raw exception/SQL messages to the client
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR",
                "An unexpected server error occurred. Please try again later.", request.getRequestURI());
    }

    // ── Helper ───────────────────────────────────────────────────────────────
    private ResponseEntity<Map<String, Object>> buildError(
            HttpStatus status, String error, String message, String path) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", error);
        body.put("message", message);
        body.put("path", path);
        return ResponseEntity.status(status).body(body);
    }
}
