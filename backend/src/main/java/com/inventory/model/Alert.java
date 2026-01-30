package com.inventory.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
public class Alert {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Enumerated(EnumType.STRING)
    private AlertType type;
    
    private String message;
    
    @Enumerated(EnumType.STRING)
    private AlertStatus status = AlertStatus.ACTIVE;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    // Constructors
    public Alert() {}
    
    public Alert(Product product, AlertType type, String message) {
        this.product = product;
        this.type = type;
        this.message = message;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    
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