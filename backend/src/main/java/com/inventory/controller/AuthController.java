package com.inventory.controller;

import com.inventory.dto.*;
import com.inventory.model.User;
import com.inventory.repository.UserRepository;
import com.inventory.security.JwtUtils;
import com.inventory.security.UserPrincipal;
import com.inventory.service.AuthService;
import com.inventory.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private PasswordResetService passwordResetService;
    
    @PostMapping("/test-email")
    public ResponseEntity<?> testEmail(@RequestParam String email) {
        try {
            ForgotPasswordRequest request = new ForgotPasswordRequest();
            request.setEmail(email);
            ApiResponse response = passwordResetService.sendOtp(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error("Email test failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/test")
    public ResponseEntity<?> test(@RequestBody(required = false) Object request) {
        System.out.println("Test endpoint called with: " + request);
        return ResponseEntity.ok(ApiResponse.success("Test endpoint working"));
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Login attempt for email: " + loginRequest.getEmail());
            
            // Basic validation
            if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Email is required"));
            }
            
            if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Password is required"));
            }
            
            String email = loginRequest.getEmail();
            String username = null;
            
            // Find user by email first
            Optional<User> userByEmail = userRepository.findByEmail(email);
            if (userByEmail.isPresent()) {
                username = userByEmail.get().getUsername();
                System.out.println("Found user by email: " + username);
            } else {
                System.out.println("User not found by email: " + email);
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid email or password"));
            }
            
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, loginRequest.getPassword())
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);
            
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Check if user is approved (except for admin)
            if (user.getRole() != User.Role.ADMIN && user.getStatus() != User.UserStatus.APPROVED) {
                String statusMessage = "";
                switch (user.getStatus()) {
                    case PENDING:
                        statusMessage = "Account pending admin approval";
                        break;
                    case REJECTED:
                        statusMessage = "Account has been rejected by admin";
                        break;
                    default:
                        statusMessage = "Account not approved";
                }
                return ResponseEntity.status(403)
                    .body(ApiResponse.error(statusMessage));
            }
            
            System.out.println("Login successful for user: " + username);
            JwtResponse response = new JwtResponse(jwt, new UserResponse(user));
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Invalid email or password"));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            ApiResponse response = authService.register(registerRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            UserResponse user = authService.getCurrentUser(userPrincipal.getUsername());
            return ResponseEntity.ok(ApiResponse.success("User details retrieved", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(ApiResponse.success("Logout successful"));
    }
    
    // Password Reset Endpoints
    
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            System.out.println("🔐 Forgot password request for: " + request.getEmail());
            ApiResponse response = passwordResetService.sendOtp(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Forgot password error: " + e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to process forgot password request"));
        }
    }
    
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        try {
            System.out.println("🔍 OTP verification request for: " + request.getEmail());
            ApiResponse response = passwordResetService.verifyOtp(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ OTP verification error: " + e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to verify OTP"));
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            System.out.println("🔄 Password reset request for: " + request.getEmail());
            ApiResponse response = passwordResetService.resetPassword(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("❌ Password reset error: " + e.getMessage());
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to reset password"));
        }
    }
}