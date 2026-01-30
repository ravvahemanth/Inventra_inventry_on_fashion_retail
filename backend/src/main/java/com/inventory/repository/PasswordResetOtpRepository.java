package com.inventory.repository;

import com.inventory.model.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {
    
    Optional<PasswordResetOtp> findByEmailAndOtpAndUsedFalse(String email, String otp);
    
    Optional<PasswordResetOtp> findTopByEmailAndUsedFalseOrderByCreatedAtDesc(String email);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM PasswordResetOtp p WHERE p.expiresAt < :now")
    void deleteExpiredOtps(@Param("now") LocalDateTime now);
    
    @Modifying
    @Transactional
    @Query("UPDATE PasswordResetOtp p SET p.used = true WHERE p.email = :email AND p.used = false")
    void markAllOtpsAsUsedForEmail(@Param("email") String email);
    
    long countByEmailAndCreatedAtAfter(String email, LocalDateTime since);
}