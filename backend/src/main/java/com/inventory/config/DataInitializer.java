package com.inventory.config;

import com.inventory.model.User;
import com.inventory.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Create default system users if not exist
        createDefaultUsers();
    }
    
    private void createDefaultUsers() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                "admin",
                "admin@inventra.com",
                passwordEncoder.encode("admin123"),
                User.Role.ADMIN
            );
            admin.setStatus(User.UserStatus.APPROVED);
            userRepository.save(admin);
            System.out.println("✅ Default Admin User Created: admin / admin123");
        }
        
        if (!userRepository.existsByUsername("manager")) {
            User manager = new User(
                "manager",
                "manager@inventra.com",
                passwordEncoder.encode("manager123"),
                User.Role.MANAGER
            );
            manager.setStatus(User.UserStatus.APPROVED);
            userRepository.save(manager);
            System.out.println("✅ Default Manager User Created: manager / manager123");
        }
        
        if (!userRepository.existsByUsername("staff")) {
            User staff = new User(
                "staff",
                "staff@inventra.com",
                passwordEncoder.encode("staff123"),
                User.Role.STAFF
            );
            staff.setStatus(User.UserStatus.APPROVED);
            userRepository.save(staff);
            System.out.println("✅ Default Staff User Created: staff / staff123");
        }
    }
}