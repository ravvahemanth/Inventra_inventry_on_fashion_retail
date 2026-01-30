package com.inventory.dto;

import com.inventory.model.ProductVariant;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductVariantResponse {
    
    private Long id;
    private Long productId;
    private String productName;
    private String size;
    private String sizeDisplayName;
    private String color;
    private String colorDisplayName;
    private Integer quantity;
    private Integer minStockLevel;
    private BigDecimal priceAdjustment;
    private BigDecimal finalPrice;
    private String variantSku;
    private String displayName;
    private boolean lowStock;
    private boolean outOfStock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public ProductVariantResponse() {}
    
    public ProductVariantResponse(ProductVariant variant) {
        this.id = variant.getId();
        this.productId = variant.getProduct() != null ? variant.getProduct().getId() : null;
        this.productName = variant.getProduct() != null ? variant.getProduct().getName() : null;
        this.size = variant.getSize() != null ? variant.getSize().name() : null;
        this.sizeDisplayName = variant.getSize() != null ? variant.getSize().getDisplayName() : null;
        this.color = variant.getColor() != null ? variant.getColor().name() : null;
        this.colorDisplayName = variant.getColor() != null ? variant.getColor().getDisplayName() : null;
        this.quantity = variant.getQuantity();
        this.minStockLevel = variant.getMinStockLevel();
        this.priceAdjustment = variant.getPriceAdjustment();
        this.finalPrice = variant.getFinalPrice();
        this.variantSku = variant.getVariantSku();
        this.displayName = variant.getDisplayName();
        this.lowStock = variant.isLowStock();
        this.outOfStock = variant.isOutOfStock();
        this.createdAt = variant.getCreatedAt();
        this.updatedAt = variant.getUpdatedAt();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
    
    public String getSizeDisplayName() { return sizeDisplayName; }
    public void setSizeDisplayName(String sizeDisplayName) { this.sizeDisplayName = sizeDisplayName; }
    
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    
    public String getColorDisplayName() { return colorDisplayName; }
    public void setColorDisplayName(String colorDisplayName) { this.colorDisplayName = colorDisplayName; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public Integer getMinStockLevel() { return minStockLevel; }
    public void setMinStockLevel(Integer minStockLevel) { this.minStockLevel = minStockLevel; }
    
    public BigDecimal getPriceAdjustment() { return priceAdjustment; }
    public void setPriceAdjustment(BigDecimal priceAdjustment) { this.priceAdjustment = priceAdjustment; }
    
    public BigDecimal getFinalPrice() { return finalPrice; }
    public void setFinalPrice(BigDecimal finalPrice) { this.finalPrice = finalPrice; }
    
    public String getVariantSku() { return variantSku; }
    public void setVariantSku(String variantSku) { this.variantSku = variantSku; }
    
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    
    public boolean isLowStock() { return lowStock; }
    public void setLowStock(boolean lowStock) { this.lowStock = lowStock; }
    
    public boolean isOutOfStock() { return outOfStock; }
    public void setOutOfStock(boolean outOfStock) { this.outOfStock = outOfStock; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}