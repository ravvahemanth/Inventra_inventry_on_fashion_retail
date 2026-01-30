package com.inventory.dto;

import com.inventory.model.ProductVariant;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public class ProductVariantRequest {
    
    @NotNull(message = "Size is required")
    private ProductVariant.Size size;
    
    @NotNull(message = "Color is required")
    private ProductVariant.Color color;
    
    @NotNull(message = "Quantity is required")
    @PositiveOrZero(message = "Quantity must be zero or positive")
    private Integer quantity;
    
    @NotNull(message = "Minimum stock level is required")
    @PositiveOrZero(message = "Minimum stock level must be zero or positive")
    private Integer minStockLevel;
    
    private BigDecimal priceAdjustment; // Can be null (no adjustment)
    
    // Constructors
    public ProductVariantRequest() {}
    
    public ProductVariantRequest(ProductVariant.Size size, ProductVariant.Color color, 
                               Integer quantity, Integer minStockLevel, BigDecimal priceAdjustment) {
        this.size = size;
        this.color = color;
        this.quantity = quantity;
        this.minStockLevel = minStockLevel;
        this.priceAdjustment = priceAdjustment;
    }
    
    // Getters and Setters
    public ProductVariant.Size getSize() { return size; }
    public void setSize(ProductVariant.Size size) { this.size = size; }
    
    public ProductVariant.Color getColor() { return color; }
    public void setColor(ProductVariant.Color color) { this.color = color; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public Integer getMinStockLevel() { return minStockLevel; }
    public void setMinStockLevel(Integer minStockLevel) { this.minStockLevel = minStockLevel; }
    
    public BigDecimal getPriceAdjustment() { return priceAdjustment; }
    public void setPriceAdjustment(BigDecimal priceAdjustment) { this.priceAdjustment = priceAdjustment; }
}