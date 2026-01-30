package com.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public class ProductRequest {
    
    @NotBlank
    private String name;
    
    private String sku; // Optional, will be auto-generated if not provided
    
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
    
    // Constructors
    public ProductRequest() {}
    
    public ProductRequest(String name, String description, String category, Integer quantity, Integer minStockLevel, BigDecimal price) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.quantity = quantity;
        this.minStockLevel = minStockLevel;
        this.price = price;
    }
    
    // Getters and Setters
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
}