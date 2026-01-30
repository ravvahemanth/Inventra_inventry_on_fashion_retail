package com.inventory.controller;

import com.inventory.dto.ApiResponse;
import com.inventory.dto.UserResponse;
import com.inventory.model.User;
import com.inventory.service.AdminService;
import com.inventory.service.StockTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    @Autowired
    private StockTransactionService stockTransactionService;
    
    @GetMapping("/pending-users")
    public ResponseEntity<?> getPendingUsers() {
        try {
            // Only get pending managers (staff are auto-approved)
            List<UserResponse> users = adminService.getPendingManagers();
            return ResponseEntity.ok(Map.of("users", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to fetch pending users: " + e.getMessage()));
        }
    }
    
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<UserResponse> users = adminService.getAllUsers();
            return ResponseEntity.ok(Map.of("users", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to fetch users: " + e.getMessage()));
        }
    }
    
    @PatchMapping("/users/{userId}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            User.UserStatus userStatus = User.UserStatus.valueOf(status.toUpperCase());
            
            UserResponse user = adminService.updateUserStatus(userId, userStatus);
            return ResponseEntity.ok(ApiResponse.success("User " + status.toLowerCase() + " successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to update user status: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            adminService.deleteUser(userId);
            return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to delete user: " + e.getMessage()));
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            Map<String, Object> stats = adminService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to fetch stats: " + e.getMessage()));
        }
    }
    
    @GetMapping("/transactions/export")
    public ResponseEntity<String> exportTransactionsCSV() {
        try {
            String csvContent = stockTransactionService.exportTransactionsToCSV();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", "transactions_" + 
                java.time.LocalDate.now().toString() + ".csv");
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(csvContent);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error exporting transactions: " + e.getMessage());
        }
    }
    
    @GetMapping("/products/export")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<String> exportProductsCSV() {
        try {
            String csvContent = adminService.exportProductsToCSV();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", "products_" + 
                java.time.LocalDate.now().toString() + ".csv");
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(csvContent);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error exporting products: " + e.getMessage());
        }
    }
    
    @GetMapping("/fashion-products/export")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<String> exportFashionProductsCSV() {
        try {
            String csvContent = adminService.exportFashionProductsToCSV();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", "fashion_products_" + 
                java.time.LocalDate.now().toString() + ".csv");
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(csvContent);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error exporting fashion products: " + e.getMessage());
        }
    }
}