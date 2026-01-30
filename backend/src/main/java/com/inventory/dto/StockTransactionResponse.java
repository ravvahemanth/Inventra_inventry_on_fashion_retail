package com.inventory.dto;

import com.inventory.model.StockTransaction;

import java.time.LocalDateTime;

public class StockTransactionResponse {
    
    private Long id;
    private Long productId;
    private Long fashionProductId;
    private Long variantId;
    private String productName;
    private String entityName;
    private String entityType;
    private String variantDetails;
    private String type;
    private Integer quantity;
    private String reason;
    private String username;
    private LocalDateTime createdAt;
    
    // Constructors
    public StockTransactionResponse() {}
    
    public StockTransactionResponse(StockTransaction transaction) {
        this.id = transaction.getId();
        this.type = transaction.getType().name();
        this.quantity = transaction.getQuantity();
        this.reason = transaction.getReason();
        this.username = transaction.getUser().getUsername();
        this.createdAt = transaction.getCreatedAt();
        this.entityName = transaction.getEntityName();
        this.entityType = transaction.getEntityType() != null ? transaction.getEntityType().name() : "REGULAR_PRODUCT";
        this.variantDetails = transaction.getVariantDetails();
        
        // Set product-specific fields based on entity type
        if (transaction.getProduct() != null) {
            this.productId = transaction.getProduct().getId();
            this.productName = transaction.getProduct().getName();
        } else if (transaction.getFashionProduct() != null) {
            this.fashionProductId = transaction.getFashionProduct().getId();
            this.productName = transaction.getFashionProduct().getName();
            if (transaction.getProductVariant() != null) {
                this.variantId = transaction.getProductVariant().getId();
            }
        }
        
        // Fallback for productName
        if (this.productName == null) {
            this.productName = this.entityName;
        }
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    
    public Long getFashionProductId() { return fashionProductId; }
    public void setFashionProductId(Long fashionProductId) { this.fashionProductId = fashionProductId; }
    
    public Long getVariantId() { return variantId; }
    public void setVariantId(Long variantId) { this.variantId = variantId; }
    
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    
    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }
    
    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    
    public String getVariantDetails() { return variantDetails; }
    public void setVariantDetails(String variantDetails) { this.variantDetails = variantDetails; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}