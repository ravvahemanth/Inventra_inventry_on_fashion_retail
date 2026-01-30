package com.inventory.config;

import com.inventory.model.User;
import com.inventory.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(3) // Run after user initialization
public class FashionDataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        System.out.println("👗 Fashion Retail System Initialized!");
        System.out.println("🎯 Ready to manage apparel, footwear & accessories!");
        
        // Ensure we have basic users
        if (userRepository.count() == 0) {
            createDefaultUsers();
        }
    }
    
    private void createDefaultUsers() {
        // Create Admin User
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@inventra.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(User.Role.ADMIN);
        admin.setStatus(User.UserStatus.APPROVED);
        userRepository.save(admin);
        
        // Create Manager User
        User manager = new User();
        manager.setUsername("manager");
        manager.setEmail("manager@inventra.com");
        manager.setPassword(passwordEncoder.encode("manager123"));
        manager.setRole(User.Role.MANAGER);
        manager.setStatus(User.UserStatus.APPROVED);
        userRepository.save(manager);
        
        // Create Staff User
        User staff = new User();
        staff.setUsername("staff");
        staff.setEmail("staff@inventra.com");
        staff.setPassword(passwordEncoder.encode("staff123"));
        staff.setRole(User.Role.STAFF);
        staff.setStatus(User.UserStatus.APPROVED);
        userRepository.save(staff);
        
        System.out.println("✅ Default users created successfully!");
        System.out.println("🔐 Admin: admin@inventra.com / admin123");
        System.out.println("👔 Manager: manager@inventra.com / manager123");
        System.out.println("👤 Staff: staff@inventra.com / staff123");
    }
}