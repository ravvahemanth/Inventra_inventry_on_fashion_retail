package com.inventory.repository;

import com.inventory.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    List<User> findByStatus(User.UserStatus status);
    
    List<User> findByStatusAndRole(User.UserStatus status, User.Role role);
    
    List<User> findByRole(User.Role role);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.status = :status")
    long countByStatus(User.UserStatus status);
}