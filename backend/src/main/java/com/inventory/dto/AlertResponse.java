package com.inventory.dto;

import com.inventory.model.Alert;
import java.time.LocalDateTime;

public class AlertResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String type;
    private String message;
    private String status;
    private LocalDateTime createdAt;

    // Constructors
    public AlertResponse() {}

    public AlertResponse(Alert alert) {
        this.id = alert.getId();
        
        // Add null safety for product and extract fashion product name from message
        if (alert.getProduct() != null) {
            this.productId = alert.getProduct().getId();
            this.productName = extractFashionProductName(alert.getMessage(), alert.getProduct().getName());
        } else {
            this.productId = null;
            this.productName = extractFashionProductName(alert.getMessage(), "Unknown Product");
        }
        
        this.type = alert.getType() != null ? alert.getType().name() : "UNKNOWN";
        this.message = alert.getMessage() != null ? alert.getMessage() : "No message";
        this.status = alert.getStatus() != null ? alert.getStatus().name() : "ACTIVE";
        this.createdAt = alert.getCreatedAt();
    }
    
    /**
     * Extract fashion product name from alert message
     * Messages typically start with "🚨 ProductName (" or "⚠️ ProductName ("
     */
    private String extractFashionProductName(String message, String fallbackName) {
        if (message == null || message.trim().isEmpty()) {
            return fallbackName;
        }
        
        try {
            // Look for pattern: "🚨 ProductName (" or "⚠️ ProductName ("
            String cleanMessage = message.trim();
            
            // Remove emoji and warning symbols
            if (cleanMessage.startsWith("🚨 ")) {
                cleanMessage = cleanMessage.substring(2).trim();
            } else if (cleanMessage.startsWith("⚠️ ")) {
                cleanMessage = cleanMessage.substring(2).trim();
            }
            
            // Extract product name (everything before the first opening parenthesis)
            int parenIndex = cleanMessage.indexOf(" (");
            if (parenIndex > 0) {
                String extractedName = cleanMessage.substring(0, parenIndex).trim();
                // Only use extracted name if it looks like a fashion product name
                if (extractedName.length() > 2 && !extractedName.toLowerCase().contains("office") 
                    && !extractedName.toLowerCase().contains("bookshelf") 
                    && !extractedName.toLowerCase().contains("pen")) {
                    return extractedName;
                }
            }
        } catch (Exception e) {
            // If extraction fails, fall back to original name
        }
        
        return fallbackName;
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
