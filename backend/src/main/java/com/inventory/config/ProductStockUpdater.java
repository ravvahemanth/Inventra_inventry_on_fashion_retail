package com.inventory.config;

import com.inventory.model.Product;
import com.inventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@Order(3) // Run after fashion product data initializer
public class ProductStockUpdater implements CommandLineRunner {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Override
    public void run(String... args) throws Exception {
        updateProductStocks();
    }
    
    private void updateProductStocks() {
        List<Product> products = productRepository.findAll();
        
        if (products.isEmpty()) {
            return;
        }
        
        for (Product product : products) {
            updateFashionProductStock(product);
            productRepository.save(product);
        }
        
        System.out.println("✅ Fashion Product stocks verified & updated. Total products: " + products.size());
    }
    
    private void updateFashionProductStock(Product product) {
        String name = product.getName() != null ? product.getName().toLowerCase() : "";
        
        // Ensure price is set appropriately
        if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            if (name.contains("tuxedo") || name.contains("blazer") || name.contains("gown") || name.contains("saree")) {
                product.setPrice(new BigDecimal("14999.00"));
            } else if (name.contains("watch") || name.contains("timepiece") || name.contains("pumps")) {
                product.setPrice(new BigDecimal("12999.00"));
            } else if (name.contains("sneaker") || name.contains("shoe") || name.contains("bag")) {
                product.setPrice(new BigDecimal("8499.00"));
            } else if (name.contains("jeans") || name.contains("hoodie") || name.contains("sweater")) {
                product.setPrice(new BigDecimal("4999.00"));
            } else {
                product.setPrice(new BigDecimal("2499.00"));
            }
        }
        
        // Ensure SKU is set
        if (product.getSku() == null || product.getSku().isEmpty()) {
            String sku = product.getName().toUpperCase()
                .replaceAll("[^A-Z0-9]", "-")
                .replaceAll("-+", "-");
            product.setSku("FSH-" + sku.substring(0, Math.min(12, sku.length())));
        }
    }
}