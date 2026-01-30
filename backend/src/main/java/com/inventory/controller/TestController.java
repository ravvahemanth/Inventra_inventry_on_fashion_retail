package com.inventory.controller;

import com.inventory.model.User;
import com.inventory.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TestController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}