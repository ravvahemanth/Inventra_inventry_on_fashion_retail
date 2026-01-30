package com.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class TransactionRequest {
    
    @NotNull
    private Long productId;
    
    @NotNull
    private String type; // "IN" or "OUT"
    
    @Min(1)
    private Integer quantity;
    
    private String notes;
    
    // Constructors
    public TransactionRequest() {}
    
    public TransactionRequest(Long productId, String type, Integer quantity, String notes) {
        this.productId = productId;
        this.type = type;
        this.quantity = quantity;
        this.notes = notes;
    }
    
    // Getters and Setters
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}