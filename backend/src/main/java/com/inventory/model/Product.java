package com.inventory.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(unique = true)
    private String name;
    
    @Column(unique = true)
    private String sku;
    
    private String description;
    
    @NotBlank
    private String category;
    
    @NotNull
    @PositiveOrZero
    private Integer quantity;
    
    @NotNull
    @PositiveOrZero
    private Integer minStockLevel;
    
    @NotNull
    private BigDecimal price;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Constructors
    public Product() {}
    
    public Product(String name, String description, String category, Integer quantity, Integer minStockLevel, BigDecimal price) {
        this.name = name;
        this.sku = generateSku(name); // Auto-generate SKU
        this.description = description;
        this.category = category;
        this.quantity = quantity;
        this.minStockLevel = minStockLevel;
        this.price = price;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { 
        this.name = name;
        if (this.sku == null || this.sku.isEmpty()) {
            this.sku = generateSku(name);
        }
    }
    
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public Integer getMinStockLevel() { return minStockLevel; }
    public void setMinStockLevel(Integer minStockLevel) { this.minStockLevel = minStockLevel; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Helper method to check if product is low stock
    public boolean isLowStock() {
        return quantity <= minStockLevel;
    }
    
    // Helper method to generate SKU
    private String generateSku(String name) {
        if (name == null || name.isEmpty()) {
            return "SKU-" + System.currentTimeMillis();
        }
        return name.toUpperCase()
                .replaceAll("[^A-Z0-9]", "")
                .substring(0, Math.min(name.length(), 8)) + 
                "-" + System.currentTimeMillis() % 10000;
    }
}