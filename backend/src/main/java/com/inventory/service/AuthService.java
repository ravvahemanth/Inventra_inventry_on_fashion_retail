package com.inventory.service;

import com.inventory.dto.*;
import com.inventory.model.User;
import com.inventory.repository.UserRepository;
import com.inventory.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    public JwtResponse login(LoginRequest loginRequest) {
        // Find user by email first
        User user = userRepository.findByEmail(loginRequest.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getUsername(), loginRequest.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        return new JwtResponse(jwt, new UserResponse(user));
    }
    
    public ApiResponse register(RegisterRequest registerRequest) {
        // Check if username exists
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ApiResponse.error("Username is already taken!");
        }
        
        // Check if email exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ApiResponse.error("Email is already in use!");
        }
        
        // Create new user with role from request
        User.Role role = User.Role.valueOf(registerRequest.getRole().toUpperCase());
        
        User user = new User(
            registerRequest.getUsername(),
            registerRequest.getEmail(),
            passwordEncoder.encode(registerRequest.getPassword()),
            role
        );
        
        // Auto-approve STAFF, require approval for MANAGER
        if (role == User.Role.STAFF) {
            user.setStatus(User.UserStatus.APPROVED);
        } else {
            user.setStatus(User.UserStatus.PENDING);
        }
        
        userRepository.save(user);
        
        String message = role == User.Role.STAFF ? 
            "Staff registered successfully. You can login now." :
            "Manager registered successfully. Waiting for admin approval.";
            
        return ApiResponse.success(message);
    }
    
    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return new UserResponse(user);
    }
}