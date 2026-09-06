package com.inventory.dto;

import com.inventory.model.FashionAlert;
import java.time.LocalDateTime;

public class FashionAlertResponse {
    private Long id;
    private Long productId;
    private String productName;
    private Long variantId;
    private String variantDetails;
    private String type;
    private String message;
    private String status;
    private LocalDateTime createdAt;

    // Constructors
    public FashionAlertResponse() {}

    public FashionAlertResponse(FashionAlert alert) {
        this.id = alert.getId();
        
        // Fashion product information
        if (alert.getFashionProduct() != null) {
            this.productId = alert.getFashionProduct().getId();
            this.productName = alert.getFashionProduct().getName();
        } else {
            this.productId = null;
            this.productName = "Unknown Product";
        }
        
        // Variant information
        if (alert.getVariant() != null) {
            this.variantId = alert.getVariant().getId();
            this.variantDetails = String.format("%s / %s", 
                alert.getVariant().getSizeDisplayName(),
                alert.getVariant().getColorDisplayName());
        } else {
            this.variantId = null;
            this.variantDetails = null;
        }
        
        this.type = alert.getType() != null ? alert.getType().name() : "UNKNOWN";
        this.message = alert.getMessage() != null ? alert.getMessage() : "No message";
        this.status = alert.getStatus() != null ? alert.getStatus().name() : "ACTIVE";
        this.createdAt = alert.getCreatedAt();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Long getVariantId() {
        return variantId;
    }

    public void setVariantId(Long variantId) {
        this.variantId = variantId;
    }

    public String getVariantDetails() {
        return variantDetails;
    }

    public void setVariantDetails(String variantDetails) {
        this.variantDetails = variantDetails;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
