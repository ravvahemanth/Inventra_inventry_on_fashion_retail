package com.inventory.dto;

import com.inventory.model.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductResponse {
    
    private Long id;
    private String name;
    private String sku;
    private String description;
    private String category;
    private Integer quantity;
    private Integer minStockLevel;
    private BigDecimal price;
    private boolean lowStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public ProductResponse() {}
    
    public ProductResponse(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.sku = product.getSku();
        this.description = product.getDescription();
        this.category = product.getCategory();
        this.quantity = product.getQuantity();
        this.minStockLevel = product.getMinStockLevel();
        this.price = product.getPrice();
        this.lowStock = product.isLowStock();
        this.createdAt = product.getCreatedAt();
        this.updatedAt = product.getUpdatedAt();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
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
    
    public boolean isLowStock() { return lowStock; }
    public void setLowStock(boolean lowStock) { this.lowStock = lowStock; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}