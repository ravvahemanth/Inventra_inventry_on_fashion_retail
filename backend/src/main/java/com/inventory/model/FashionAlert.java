package com.inventory.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "fashion_alerts")
public class FashionAlert {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fashion_product_id", nullable = false)
    private FashionProduct fashionProduct;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = true)
    private ProductVariant variant;
    
    @Enumerated(EnumType.STRING)
    private AlertType type;
    
    private String message;
    
    @Enumerated(EnumType.STRING)
    private AlertStatus status = AlertStatus.ACTIVE;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    // Constructors
    public FashionAlert() {}
    
    public FashionAlert(FashionProduct fashionProduct, AlertType type, String message) {
        this.fashionProduct = fashionProduct;
        this.type = type;
        this.message = message;
    }
    
    public FashionAlert(FashionProduct fashionProduct, ProductVariant variant, AlertType type, String message) {
        this.fashionProduct = fashionProduct;
        this.variant = variant;
        this.type = type;
        this.message = message;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public FashionProduct getFashionProduct() { return fashionProduct; }
    public void setFashionProduct(FashionProduct fashionProduct) { this.fashionProduct = fashionProduct; }
    
    public ProductVariant getVariant() { return variant; }
    public void setVariant(ProductVariant variant) { this.variant = variant; }
    
    public AlertType getType() { return type; }
    public void setType(AlertType type) { this.type = type; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public AlertStatus getStatus() { return status; }
    public void setStatus(AlertStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public enum AlertType {
        LOW_STOCK, OUT_OF_STOCK
    }
    
    public enum AlertStatus {
        ACTIVE, RESOLVED
    }
}