package com.inventory.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class StockTransactionRequest {
    
    // For regular products (legacy support)
    private Long productId;
    
    // For fashion products (new support)
    private Long fashionProductId;
    private Long variantId;
    
    @NotNull(message = "Transaction type is required")
    private String type; // Should accept "STOCK_IN" or "STOCK_OUT"
    
    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;
    
    private String reason;
    
    // Getters and Setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    
    public Long getFashionProductId() { return fashionProductId; }
    public void setFashionProductId(Long fashionProductId) { this.fashionProductId = fashionProductId; }
    
    public Long getVariantId() { return variantId; }
    public void setVariantId(Long variantId) { this.variantId = variantId; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    
    // Helper method to determine if this is a fashion product transaction
    public boolean isFashionProduct() {
        return fashionProductId != null && variantId != null;
    }
    
    // Helper method to determine if this is a regular product transaction
    public boolean isRegularProduct() {
        return productId != null;
    }
    
    @Override
    public String toString() {
        return "StockTransactionRequest{" +
                "productId=" + productId +
                ", fashionProductId=" + fashionProductId +
                ", variantId=" + variantId +
                ", type='" + type + '\'' +
                ", quantity=" + quantity +
                ", reason='" + reason + '\'' +
                '}';
    }
}
