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
        String name = product.getName() != null ? product.getName().toLowerCase() : "";
        
        // Set stock quantities based on fashion product type
        if (name.contains("blazer") || name.contains("tuxedo") || name.contains("suit")) {
            product.setQuantity(25);
            product.setMinStockLevel(5);
            if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) == 0) {
                product.setPrice(new BigDecimal("14999.00"));
            }
            product.setCategory("Men's Luxury Wear");
        } else if (name.contains("saree") || name.contains("gown") || name.contains("dress")) {
            product.setQuantity(20);
            product.setMinStockLevel(5);
            if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) == 0) {
                product.setPrice(new BigDecimal("18499.00"));
            }
            product.setCategory("Women's Haute Couture");
        } else if (name.contains("sneaker") || name.contains("shoe") || name.contains("pumps") || name.contains("oxford")) {
            product.setQuantity(30);
            product.setMinStockLevel(8);
            if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) == 0) {
                product.setPrice(new BigDecimal("8999.00"));
            }
            product.setCategory("Footwear Collection");
        } else if (name.contains("bag") || name.contains("messenger") || name.contains("handbag")) {
            product.setQuantity(15);
            product.setMinStockLevel(4);
            if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) == 0) {
                product.setPrice(new BigDecimal("11499.00"));
            }
            product.setCategory("Luxury Leather & Bags");
        } else if (name.contains("watch") || name.contains("timepiece") || name.contains("sunglasses") || name.contains("belt")) {
            product.setQuantity(25);
            product.setMinStockLevel(6);
            if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) == 0) {
                product.setPrice(new BigDecimal("5999.00"));
            }
            product.setCategory("Accessories & Timepieces");
        } else if (name.contains("hoodie") || name.contains("jeans") || name.contains("sweater") || name.contains("jacket")) {
            product.setQuantity(40);
            product.setMinStockLevel(10);
            if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) == 0) {
                product.setPrice(new BigDecimal("4499.00"));
            }
            product.setCategory("Streetwear & Apparel");
        } else {
            product.setQuantity(25);
            product.setMinStockLevel(5);
            if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) == 0) {
                product.setPrice(new BigDecimal("2999.00"));
            }
            product.setCategory("Fashion Retail");
        }
        
        // Ensure SKU is set
        if (product.getSku() == null || product.getSku().isEmpty()) {
            String sku = product.getName().toUpperCase()
                .replaceAll("[^A-Z0-9]", "-")
                .replaceAll("-+", "-")
                .substring(0, Math.min(12, product.getName().length()));
            product.setSku("FSH-" + sku + "-" + (product.getId() != null ? String.format("%03d", product.getId()) : "001"));
        }
        
        // Ensure description is set
        if (product.getDescription() == null || product.getDescription().isEmpty()) {
            product.setDescription("Premium quality " + product.getName().toLowerCase() + " tailored for contemporary fashion retail.");
        }
    }
}