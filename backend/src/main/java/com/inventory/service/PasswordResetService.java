package com.inventory.service;

import com.inventory.dto.*;
import com.inventory.model.PasswordResetOtp;
import com.inventory.model.User;
import com.inventory.repository.PasswordResetOtpRepository;
import com.inventory.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PasswordResetService {
    
    @Autowired
    private PasswordResetOtpRepository otpRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired(required = false)
    private EmailService emailService;
    
    @Autowired(required = false)
    private MockEmailService mockEmailService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Value("${app.email.mock:false}")
    private boolean useMockEmail;
    
    private static final int OTP_EXPIRY_MINUTES = 10;
    private static final int MAX_OTP_ATTEMPTS = 3;
    private static final int MAX_DAILY_REQUESTS = 5;
    
    @Transactional
    public ApiResponse sendOtp(ForgotPasswordRequest request) {
        try {
            String email = request.getEmail().toLowerCase().trim();
            
            // Check if user exists
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (!userOpt.isPresent()) {
                // For security, don't reveal if email exists or not
                return ApiResponse.success("If the email exists in our system, an OTP has been sent.");
            }
            
            User user = userOpt.get();
            
            // Check daily limit
            LocalDateTime dayStart = LocalDateTime.now().minusHours(24);
            long dailyRequests = otpRepository.countByEmailAndCreatedAtAfter(email, dayStart);
            if (dailyRequests >= MAX_DAILY_REQUESTS) {
                return ApiResponse.error("Too many OTP requests. Please try again after 24 hours.");
            }
            
            // Clean up expired OTPs
            otpRepository.deleteExpiredOtps(LocalDateTime.now());
            
            // Mark all previous OTPs as used
            otpRepository.markAllOtpsAsUsedForEmail(email);
            
            // Generate new OTP
            String otp = generateOtp();
            LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);
            
            // Save OTP
            PasswordResetOtp otpEntity = new PasswordResetOtp(email, otp, expiresAt);
            otpRepository.save(otpEntity);
            
            // Send email
            try {
                if (useMockEmail && mockEmailService != null) {
                    System.out.println("📧 Using Mock Email Service (Development Mode)");
                    mockEmailService.sendOtpEmail(email, otp, user.getUsername());
                } else if (emailService != null) {
                    System.out.println("📧 Using Real Email Service (Production Mode)");
                    emailService.sendOtpEmail(email, otp, user.getUsername());
                } else {
                    throw new RuntimeException("No email service available");
                }
            } catch (Exception emailError) {
                System.err.println("❌ Email sending failed: " + emailError.getMessage());
                // If real email fails, try mock as fallback
                if (!useMockEmail && mockEmailService != null) {
                    System.out.println("📧 Falling back to Mock Email Service");
                    mockEmailService.sendOtpEmail(email, otp, user.getUsername());
                } else {
                    // Clean up the OTP if email sending fails
                    otpRepository.delete(otpEntity);
                    return ApiResponse.error("Failed to send OTP email. Please check your email configuration or try again later.");
                }
            }
            
            System.out.println("🔐 OTP generated for " + email + ": " + otp + " (expires at " + expiresAt + ")");
            
            return ApiResponse.success("OTP has been sent to your email address. Please check your inbox.");
            
        } catch (Exception e) {
            System.err.println("❌ Error sending OTP: " + e.getMessage());
            e.printStackTrace();
            return ApiResponse.error("Failed to send OTP. Please try again later.");
        }
    }
    
    @Transactional
    public ApiResponse verifyOtp(VerifyOtpRequest request) {
        try {
            String email = request.getEmail().toLowerCase().trim();
            String otp = request.getOtp().trim();
            
            // Find the latest valid OTP for this email
            Optional<PasswordResetOtp> otpOpt = otpRepository.findTopByEmailAndUsedFalseOrderByCreatedAtDesc(email);
            
            if (!otpOpt.isPresent()) {
                return ApiResponse.error("No valid OTP found. Please request a new OTP.");
            }
            
            PasswordResetOtp otpEntity = otpOpt.get();
            
            // Check if OTP is expired
            if (otpEntity.isExpired()) {
                return ApiResponse.error("OTP has expired. Please request a new OTP.");
            }
            
            // Check attempts limit
            if (otpEntity.getAttempts() >= MAX_OTP_ATTEMPTS) {
                return ApiResponse.error("Maximum OTP attempts exceeded. Please request a new OTP.");
            }
            
            // Increment attempts
            otpEntity.incrementAttempts();
            otpRepository.save(otpEntity);
            
            // Verify OTP
            if (!otpEntity.getOtp().equals(otp)) {
                int remainingAttempts = MAX_OTP_ATTEMPTS - otpEntity.getAttempts();
                if (remainingAttempts > 0) {
                    return ApiResponse.error("Invalid OTP. You have " + remainingAttempts + " attempts remaining.");
                } else {
                    return ApiResponse.error("Invalid OTP. Maximum attempts exceeded. Please request a new OTP.");
                }
            }
            
            System.out.println("✅ OTP verified successfully for: " + email);
            return ApiResponse.success("OTP verified successfully. You can now reset your password.");
            
        } catch (Exception e) {
            System.err.println("❌ Error verifying OTP: " + e.getMessage());
            e.printStackTrace();
            return ApiResponse.error("Failed to verify OTP. Please try again.");
        }
    }
    
    @Transactional
    public ApiResponse resetPassword(ResetPasswordRequest request) {
        try {
            String email = request.getEmail().toLowerCase().trim();
            String otp = request.getOtp().trim();
            
            // Validate password match
            if (!request.isPasswordMatch()) {
                return ApiResponse.error("Passwords do not match.");
            }
            
            // Find and verify OTP
            Optional<PasswordResetOtp> otpOpt = otpRepository.findByEmailAndOtpAndUsedFalse(email, otp);
            
            if (!otpOpt.isPresent()) {
                return ApiResponse.error("Invalid or expired OTP.");
            }
            
            PasswordResetOtp otpEntity = otpOpt.get();
            
            if (!otpEntity.isValid()) {
                return ApiResponse.error("OTP is invalid, expired, or has exceeded maximum attempts.");
            }
            
            // Find user
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (!userOpt.isPresent()) {
                return ApiResponse.error("User not found.");
            }
            
            User user = userOpt.get();
            
            // Update password
            String encodedPassword = passwordEncoder.encode(request.getNewPassword());
            user.setPassword(encodedPassword);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            
            // Mark OTP as used
            otpEntity.setUsed(true);
            otpRepository.save(otpEntity);
            
            // Send confirmation email
            try {
                if (useMockEmail && mockEmailService != null) {
                    mockEmailService.sendPasswordResetConfirmationEmail(email, user.getUsername());
                } else if (emailService != null) {
                    emailService.sendPasswordResetConfirmationEmail(email, user.getUsername());
                }
            } catch (Exception emailError) {
                System.err.println("⚠️ Failed to send confirmation email: " + emailError.getMessage());
                // Don't fail the password reset if confirmation email fails
            }
            
            System.out.println("✅ Password reset successfully for: " + email);
            return ApiResponse.success("Password has been reset successfully. You can now login with your new password.");
            
        } catch (Exception e) {
            System.err.println("❌ Error resetting password: " + e.getMessage());
            e.printStackTrace();
            return ApiResponse.error("Failed to reset password. Please try again.");
        }
    }
    
    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000); // 6-digit OTP
        return String.valueOf(otp);
    }
}