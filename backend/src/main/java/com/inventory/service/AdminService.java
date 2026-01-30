package com.inventory.service;

import com.inventory.dto.UserResponse;
import com.inventory.model.User;
import com.inventory.model.Product;
import com.inventory.model.FashionProduct;
import com.inventory.model.ProductVariant;
import com.inventory.repository.AlertRepository;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.FashionProductRepository;
import com.inventory.repository.StockTransactionRepository;
import com.inventory.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private FashionProductRepository fashionProductRepository;
    
    @Autowired
    private StockTransactionRepository stockTransactionRepository;
    
    @Autowired
    private AlertRepository alertRepository;
    
    public List<UserResponse> getPendingManagers() {
        return userRepository.findByStatusAndRole(User.UserStatus.PENDING, User.Role.MANAGER)
            .stream()
            .map(UserResponse::new)
            .collect(Collectors.toList());
    }
    
    public List<UserResponse> getPendingUsers() {
        return userRepository.findByStatus(User.UserStatus.PENDING)
            .stream()
            .map(UserResponse::new)
            .collect(Collectors.toList());
    }
    
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
            .stream()
            .map(UserResponse::new)
            .collect(Collectors.toList());
    }
    
    public UserResponse updateUserStatus(Long userId, User.UserStatus status) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() == User.Role.ADMIN) {
            throw new RuntimeException("Cannot modify admin user");
        }
        
        user.setStatus(status);
        User updatedUser = userRepository.save(user);
        
        return new UserResponse(updatedUser);
    }
    
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() == User.Role.ADMIN) {
            throw new RuntimeException("Cannot delete admin user");
        }
        
        userRepository.delete(user);
    }
    
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // User statistics
        Map<String, Long> userStats = new HashMap<>();
        for (User.UserStatus status : User.UserStatus.values()) {
            userStats.put(status.name().toLowerCase(), userRepository.countByStatus(status));
        }
        stats.put("users", userStats);
        
        // Product statistics
        Map<String, Object> productStats = new HashMap<>();
        productStats.put("totalProducts", productRepository.getTotalProductCount());
        productStats.put("totalStock", productRepository.getTotalStockQuantity());
        productStats.put("lowStockCount", productRepository.findLowStockProducts().size());
        productStats.put("outOfStockCount", productRepository.findOutOfStockProducts().size());
        stats.put("products", productStats);
        
        // Transaction statistics
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        long recentTransactions = stockTransactionRepository.countByCreatedAtAfter(weekAgo);
        stats.put("recentTransactions", recentTransactions);
        
        // Alert statistics
        long activeAlerts = alertRepository.findByStatusOrderByCreatedAtDesc(com.inventory.model.Alert.AlertStatus.ACTIVE).size();
        stats.put("activeAlerts", activeAlerts);
        
        return stats;
    }
    
    /**
     * Export all products to CSV format
     */
    public String exportProductsToCSV() {
        System.out.println("📦 Exporting all products to CSV...");
        
        List<Product> products = productRepository.findAllByOrderByCreatedAtDesc();
        
        StringBuilder csv = new StringBuilder();
        
        // CSV Headers
        csv.append("Product Name,SKU,Description,Category,Current Stock,Min Stock Level,Price,Stock Status,Created Date,Last Updated\n");
        
        // CSV Data
        for (Product product : products) {
            csv.append(formatCSVField(product.getName())).append(",");
            csv.append(formatCSVField(product.getSku())).append(",");
            csv.append(formatCSVField(product.getDescription() != null ? product.getDescription() : "")).append(",");
            csv.append(formatCSVField(product.getCategory())).append(",");
            csv.append(product.getQuantity()).append(",");
            csv.append(product.getMinStockLevel()).append(",");
            csv.append(product.getPrice()).append(",");
            
            // Stock Status
            String stockStatus;
            if (product.getQuantity() == 0) {
                stockStatus = "Out of Stock";
            } else if (product.isLowStock()) {
                stockStatus = "Low Stock";
            } else {
                stockStatus = "In Stock";
            }
            csv.append(formatCSVField(stockStatus)).append(",");
            
            csv.append(formatCSVField(product.getCreatedAt().toString())).append(",");
            csv.append(formatCSVField(product.getUpdatedAt() != null ? product.getUpdatedAt().toString() : "")).append("\n");
        }
        
        System.out.println("✅ Products CSV export completed with " + products.size() + " products");
        return csv.toString();
    }
    
    /**
     * Export all fashion products to CSV format
     */
    public String exportFashionProductsToCSV() {
        System.out.println("👗 Exporting all fashion products to CSV...");
        
        List<FashionProduct> products = fashionProductRepository.findAllByOrderByCreatedAtDesc();
        
        StringBuilder csv = new StringBuilder();
        
        // CSV Headers
        csv.append("Product Name,SKU,Description,Category,Brand,Season,Target Gender,Material,Base Price,Total Stock,Total Min Stock,Stock Status,Variants Count,Created Date,Last Updated\n");
        
        // CSV Data
        for (FashionProduct product : products) {
            csv.append(formatCSVField(product.getName())).append(",");
            csv.append(formatCSVField(product.getSku())).append(",");
            csv.append(formatCSVField(product.getDescription() != null ? product.getDescription() : "")).append(",");
            csv.append(formatCSVField(product.getCategory() != null ? product.getCategory().getDisplayName() : "")).append(",");
            csv.append(formatCSVField(product.getBrand())).append(",");
            csv.append(formatCSVField(product.getSeason() != null ? product.getSeason().getDisplayName() : "")).append(",");
            csv.append(formatCSVField(product.getTargetGender() != null ? product.getTargetGender().getDisplayName() : "")).append(",");
            csv.append(formatCSVField(product.getMaterial() != null ? product.getMaterial() : "")).append(",");
            csv.append(product.getBasePrice()).append(",");
            csv.append(product.getTotalStock()).append(",");
            csv.append(product.getTotalMinStock()).append(",");
            
            // Stock Status
            String stockStatus;
            if (product.isOutOfStock()) {
                stockStatus = "Out of Stock";
            } else if (product.isLowStock()) {
                stockStatus = "Low Stock";
            } else {
                stockStatus = "In Stock";
            }
            csv.append(formatCSVField(stockStatus)).append(",");
            
            csv.append(product.getVariants().size()).append(",");
            csv.append(formatCSVField(product.getCreatedAt().toString())).append(",");
            csv.append(formatCSVField(product.getUpdatedAt() != null ? product.getUpdatedAt().toString() : "")).append("\n");
            
            // Add variant details as separate rows
            for (ProductVariant variant : product.getVariants()) {
                csv.append("  - Variant,");
                csv.append(formatCSVField(variant.getSku())).append(",");
                csv.append(formatCSVField("Size: " + variant.getSize().getDisplayName() + ", Color: " + variant.getColor().getDisplayName())).append(",");
                csv.append("Variant,");
                csv.append(formatCSVField(product.getBrand())).append(",");
                csv.append(formatCSVField(product.getSeason() != null ? product.getSeason().getDisplayName() : "")).append(",");
                csv.append(formatCSVField(product.getTargetGender() != null ? product.getTargetGender().getDisplayName() : "")).append(",");
                csv.append(formatCSVField(product.getMaterial() != null ? product.getMaterial() : "")).append(",");
                csv.append(variant.getFinalPrice()).append(",");
                csv.append(variant.getQuantity()).append(",");
                csv.append(variant.getMinStockLevel()).append(",");
                
                // Variant Stock Status
                String variantStockStatus;
                if (variant.isOutOfStock()) {
                    variantStockStatus = "Out of Stock";
                } else if (variant.isLowStock()) {
                    variantStockStatus = "Low Stock";
                } else {
                    variantStockStatus = "In Stock";
                }
                csv.append(formatCSVField(variantStockStatus)).append(",");
                
                csv.append("1,"); // Variants count for variant row
                csv.append(formatCSVField(variant.getCreatedAt().toString())).append(",");
                csv.append(formatCSVField(variant.getUpdatedAt() != null ? variant.getUpdatedAt().toString() : "")).append("\n");
            }
        }
        
        System.out.println("✅ Fashion products CSV export completed with " + products.size() + " products");
        return csv.toString();
    }
    
    /**
     * Format CSV field to handle commas and quotes
     */
    private String formatCSVField(String field) {
        if (field == null) {
            return "";
        }
        
        // Escape quotes and wrap in quotes if contains comma or quote
        if (field.contains(",") || field.contains("\"") || field.contains("\n")) {
            return "\"" + field.replace("\"", "\"\"") + "\"";
        }
        
        return field;
    }
}