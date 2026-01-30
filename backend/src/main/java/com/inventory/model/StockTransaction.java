package com.inventory.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_transactions")
public class StockTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Support for regular products (legacy)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
    
    // Support for fashion product variants (new)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fashion_product_id")
    private FashionProduct fashionProduct;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id")
    private ProductVariant productVariant;
    
    // Entity details for unified display
    @Column(name = "entity_name")
    private String entityName; // Product or Fashion Product name
    
    @Column(name = "entity_type")
    @Enumerated(EnumType.STRING)
    private EntityType entityType; // REGULAR_PRODUCT or FASHION_PRODUCT
    
    @Column(name = "variant_details")
    private String variantDetails; // Size/Color info for fashion products
    
    @Enumerated(EnumType.STRING)
    private TransactionType type;
    
    @NotNull
    private Integer quantity;
    
    private String reason;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    // Constructors
    public StockTransaction() {}
    
    // Constructor for regular products (legacy)
    public StockTransaction(Product product, TransactionType type, Integer quantity, String reason, User user) {
        this.product = product;
        this.entityName = product.getName();
        this.entityType = EntityType.REGULAR_PRODUCT;
        this.type = type;
        this.quantity = quantity;
        this.reason = reason;
        this.user = user;
    }
    
    // Constructor for fashion product variants (new)
    public StockTransaction(FashionProduct fashionProduct, ProductVariant variant, TransactionType type, 
                           Integer quantity, String reason, User user) {
        this.fashionProduct = fashionProduct;
        this.productVariant = variant;
        this.entityName = fashionProduct.getName();
        this.entityType = EntityType.FASHION_PRODUCT;
        this.variantDetails = variant.getSizeDisplayName() + "/" + variant.getColorDisplayName();
        this.type = type;
        this.quantity = quantity;
        this.reason = reason;
        this.user = user;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    
    public FashionProduct getFashionProduct() { return fashionProduct; }
    public void setFashionProduct(FashionProduct fashionProduct) { this.fashionProduct = fashionProduct; }
    
    public ProductVariant getProductVariant() { return productVariant; }
    public void setProductVariant(ProductVariant productVariant) { this.productVariant = productVariant; }
    
    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }
    
    public EntityType getEntityType() { return entityType; }
    public void setEntityType(EntityType entityType) { this.entityType = entityType; }
    
    public String getVariantDetails() { return variantDetails; }
    public void setVariantDetails(String variantDetails) { this.variantDetails = variantDetails; }
    
    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public enum TransactionType {
        STOCK_IN, STOCK_OUT
    }
    
    public enum EntityType {
        REGULAR_PRODUCT, FASHION_PRODUCT
    }
}