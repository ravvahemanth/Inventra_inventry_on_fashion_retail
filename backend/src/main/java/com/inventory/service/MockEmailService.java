package com.inventory.service;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("dev")
public class MockEmailService {
    
    public void sendOtpEmail(String toEmail, String otp, String userName) {
        System.out.println("=".repeat(60));
        System.out.println("📧 MOCK EMAIL SERVICE - OTP EMAIL");
        System.out.println("=".repeat(60));
        System.out.println("To: " + toEmail);
        System.out.println("Subject: Password Reset OTP - Inventory Management System");
        System.out.println("");
        System.out.println("Dear " + (userName != null ? userName : "User") + ",");
        System.out.println("");
        System.out.println("Your OTP for password reset is: " + otp);
        System.out.println("");
        System.out.println("⏰ This OTP is valid for 10 minutes only.");
        System.out.println("🔒 Do not share this OTP with anyone.");
        System.out.println("");
        System.out.println("=".repeat(60));
        System.out.println("✅ Mock email sent successfully!");
        System.out.println("=".repeat(60));
    }
    
    public void sendPasswordResetConfirmationEmail(String toEmail, String userName) {
        System.out.println("=".repeat(60));
        System.out.println("📧 MOCK EMAIL SERVICE - PASSWORD RESET CONFIRMATION");
        System.out.println("=".repeat(60));
        System.out.println("To: " + toEmail);
        System.out.println("Subject: Password Reset Successful");
        System.out.println("");
        System.out.println("Dear " + (userName != null ? userName : "User") + ",");
        System.out.println("");
        System.out.println("Your password has been successfully reset!");
        System.out.println("");
        System.out.println("=".repeat(60));
        System.out.println("✅ Mock confirmation email sent!");
        System.out.println("=".repeat(60));
    }
}