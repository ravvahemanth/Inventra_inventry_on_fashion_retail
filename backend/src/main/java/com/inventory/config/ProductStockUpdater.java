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
@Order(2) // Run after DataInitializer
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
            System.out.println("⚠️ No products found in database");
            return;
        }
        
        System.out.println("🔄 Updating product stock quantities...");
        
        for (Product product : products) {
            // Update stock quantities based on product name or create reasonable defaults
            updateProductStock(product);
            productRepository.save(product);
        }
        
        System.out.println("✅ Product stock quantities updated successfully!");
        System.out.println("📊 Total products updated: " + products.size());
    }
    
    private void updateProductStock(Product product) {
        String name = product.getName().toLowerCase();
        
        // Set stock quantities based on product type
        if (name.contains("laptop") || name.contains("computer")) {
            product.setQuantity(25);
            product.setMinStockLevel(5);
            if (product.getPrice() == null) product.setPrice(new BigDecimal("45000.00"));
        } else if (name.contains("phone") || name.contains("mobile") || name.contains("smartphone")) {
            product.setQuantity(40);
            product.setMinStockLevel(10);
            if (product.getPrice() == null) product.setPrice(new BigDecimal("25000.00"));
        } else if (name.contains("headphone") || name.contains("earphone") || name.contains("audio")) {
            product.setQuantity(60);
            product.setMinStockLevel(15);
            if (product.getPrice() == null) product.setPrice(new BigDecimal("5000.00"));
        } else if (name.contains("mouse") || name.contains("keyboard")) {
            product.setQuantity(35);
            product.setMinStockLevel(10);
            if (product.getPrice() == null) product.setPrice(new BigDecimal("1500.00"));
        } else if (name.contains("printer") || name.contains("scanner")) {
            product.setQuantity(12);
            product.setMinStockLevel(3);
            if (product.getPrice() == null) product.setPrice(new BigDecimal("15000.00"));
        } else if (name.contains("chair") || name.contains("desk") || name.contains("table")) {
            product.setQuantity(15);
            product.setMinStockLevel(3);
            if (product.getPrice() == null) product.setPrice(new BigDecimal("12000.00"));
        } else if (name.contains("pen") || name.contains("pencil") || name.contains("marker")) {
            product.setQuantity(100);
            product.setMinStockLevel(25);
            if (product.getPrice() == null) product.setPrice(new BigDecimal("200.00"));
        } else if (name.contains("notebook") || name.contains("paper") || name.contains("book")) {
            product.setQuantity(80);
            product.setMinStockLevel(20);
            if (product.getPrice() == null) product.setPrice(new BigDecimal("150.00"));
        } else if (name.contains("cable") || name.contains("charger") || name.contains("adapter")) {
            product.setQuantity(50);
            product.setMinStockLevel(15);
            if (product.getPrice() == null) product.setPrice(new BigDecimal("800.00"));
        } else {
            // Default values for unknown products
            product.setQuantity(30);
            product.setMinStockLevel(8);
            if (product.getPrice() == null) product.setPrice(new BigDecimal("1000.00"));
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
        
        // Ensure SKU is set
        if (product.getSku() == null || product.getSku().isEmpty()) {
            String sku = product.getName().toUpperCase()
                .replaceAll("[^A-Z0-9]", "-")
                .replaceAll("-+", "-")
                .substring(0, Math.min(15, product.getName().length()));
            product.setSku(sku + "-" + String.format("%03d", product.getId()));
        }
        
        // Ensure description is set
        if (product.getDescription() == null || product.getDescription().isEmpty()) {
            product.setDescription("High-quality " + product.getName().toLowerCase() + " for office and personal use");
        }
        
        System.out.println("📦 Updated: " + product.getName() + " - Quantity: " + product.getQuantity() + " - Price: ₹" + product.getPrice());
    }
}