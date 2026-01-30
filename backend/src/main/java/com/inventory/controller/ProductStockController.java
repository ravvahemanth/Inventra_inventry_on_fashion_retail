package com.inventory.controller;

import com.inventory.dto.ApiResponse;
import com.inventory.model.Product;
import com.inventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/stock")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProductStockController {
    
    @Autowired
    private ProductRepository productRepository;
    
    @PostMapping("/update-all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAllProductStocks() {
        try {
            List<Product> products = productRepository.findAll();
            
            if (products.isEmpty()) {
                return ResponseEntity.ok(ApiResponse.error("No products found in database"));
            }
            
            int updatedCount = 0;
            
            for (Product product : products) {
                updateProductStock(product);
                productRepository.save(product);
                updatedCount++;
            }
            
            return ResponseEntity.ok(ApiResponse.success(
                "Successfully updated stock for " + updatedCount + " products", 
                updatedCount
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Failed to update product stocks: " + e.getMessage()));
        }
    }
    
    private void updateProductStock(Product product) {
        String name = product.getName().toLowerCase();
        
        // Set stock quantities based on product type
        if (name.contains("laptop") || name.contains("computer")) {
            product.setQuantity(25);
            product.setMinStockLevel(5);
            if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) == 0) {
                product.setPrice(new BigDecimal("45000.00"));
            }
        } else if (name.contains("phone") || name.contains("mobile") || name.contains("smartphone")) {
            product.setQuantity(40);
            product.setMinStockLevel(10);
            if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) == 0) {
                product.setPrice(new BigDecimal("25000.00"));
            }
        } else if (name.contains("headphone") || name.contains("earphone") || name.contains("audio")) {
            product.setQuantity(60);
            product.setMinStockLevel(15);
            if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) == 0) {
                product.setPrice(new BigDecimal("5000.00"));
            }
        } else if (name.contains("mouse") || name.contains("keyboard")) {
            product.setQuantity(35);
            product.setMinStockLevel(10);
            if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) == 0) {
                product.setPrice(new BigDecimal("1500.00"));
            }
        } else if (name.contains("printer") || name.contains("scanner")) {
            product.setQuantity(12);
            product.setMinStockLevel(3);
            if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) == 0) {
                product.setPrice(new BigDecimal("15000.00"));
            }
        } else if (name.contains("chair") || name.contains("desk") || name.contains("table")) {
            product.setQuantity(15);
            product.setMinStockLevel(3);
            if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) == 0) {
                product.setPrice(new BigDecimal("12000.00"));
            }
        } else if (name.contains("pen") || name.contains("pencil") || name.contains("marker")) {
            product.setQuantity(100);
            product.setMinStockLevel(25);
            if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) == 0) {
                product.setPrice(new BigDecimal("200.00"));
            }
        } else if (name.contains("notebook") || name.contains("paper") || name.contains("book")) {
            product.setQuantity(80);
            product.setMinStockLevel(20);
            if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) == 0) {
                product.setPrice(new BigDecimal("150.00"));
            }
        } else if (name.contains("cable") || name.contains("charger") || name.contains("adapter")) {
            product.setQuantity(50);
            product.setMinStockLevel(15);
            if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) == 0) {
                product.setPrice(new BigDecimal("800.00"));
            }
        } else {
            // Default values for unknown products
            product.setQuantity(30);
            product.setMinStockLevel(8);
            if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) == 0) {
                product.setPrice(new BigDecimal("1000.00"));
            }
        }
        
        // Ensure category is set
        if (product.getCategory() == null || product.getCategory().isEmpty()) {
            if (name.contains("laptop") || name.contains("phone") || name.contains("computer") || 
                name.contains("mouse") || name.contains("keyboard") || name.contains("headphone")) {
                product.setCategory("Electronics");
            } else if (name.contains("chair") || name.contains("desk") || name.contains("table")) {
                product.setCategory("Furniture");
            } else if (name.contains("pen") || name.contains("pencil") || name.contains("marker")) {
                product.setCategory("Stationery");
            } else {
                product.setCategory("Office Supplies");
            }
        }
        
        // Ensure description is set
        if (product.getDescription() == null || product.getDescription().isEmpty()) {
            product.setDescription("High-quality " + product.getName().toLowerCase() + " for office and personal use");
        }
    }
}