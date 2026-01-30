package com.inventory.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username:inventrainfosys@gmail.com}")
    private String fromEmail;
    
    public void sendOtpEmail(String toEmail, String otp, String userName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("🔐 Password Reset OTP - Inventory Management System");
            
            String emailBody = String.format(
                "Dear %s,\n\n" +
                "You have requested to reset your password for your Inventory Management System account.\n\n" +
                "═══════════════════════════════════════\n" +
                "Your One-Time Password (OTP) is: %s\n" +
                "═══════════════════════════════════════\n\n" +
                "⏰ This OTP is valid for 10 minutes only.\n" +
                "🔒 Please do not share this OTP with anyone.\n" +
                "🚫 If you did not request this password reset, please ignore this email.\n\n" +
                "For your security:\n" +
                "• Enter this OTP on the password reset page\n" +
                "• You have maximum 3 attempts to enter the correct OTP\n" +
                "• This OTP will expire automatically after 10 minutes\n\n" +
                "If you need assistance, please contact our support team.\n\n" +
                "Best regards,\n" +
                "Inventory Management System Team\n" +
                "📧 inventrainfosys@gmail.com",
                userName != null ? userName : "User",
                otp
            );
            
            message.setText(emailBody);
            
            mailSender.send(message);
            System.out.println("✅ OTP email sent successfully to: " + toEmail);
            
        } catch (Exception e) {
            System.err.println("❌ Failed to send OTP email to: " + toEmail);
            e.printStackTrace();
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }
    
    public void sendPasswordResetConfirmationEmail(String toEmail, String userName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("✅ Password Reset Successful - Inventory Management System");
            
            String emailBody = String.format(
                "Dear %s,\n\n" +
                "✅ Your password has been successfully reset for your Inventory Management System account.\n\n" +
                "🔐 Your new password is now active and you can login with it.\n\n" +
                "⚠️ If you did not perform this action, please contact our support team immediately.\n\n" +
                "For your security:\n" +
                "• Use a strong, unique password\n" +
                "• Do not share your password with anyone\n" +
                "• Log out from shared devices after use\n" +
                "• Enable two-factor authentication if available\n\n" +
                "Thank you for using our Inventory Management System.\n\n" +
                "Best regards,\n" +
                "Inventory Management System Team\n" +
                "📧 inventrainfosys@gmail.com",
                userName != null ? userName : "User"
            );
            
            message.setText(emailBody);
            
            mailSender.send(message);
            System.out.println("✅ Password reset confirmation email sent to: " + toEmail);
            
        } catch (Exception e) {
            System.err.println("❌ Failed to send confirmation email to: " + toEmail);
            e.printStackTrace();
            // Don't throw exception here as password reset was successful
        }
    }
}