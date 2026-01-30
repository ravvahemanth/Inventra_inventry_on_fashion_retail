package com.inventory.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "fashion_products")
public class FashionProduct {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Column(unique = true)
    private String name;
    
    @Column(unique = true)
    private String sku;
    
    private String description;
    
    @NotNull(message = "Category is required")
    @Enumerated(EnumType.STRING)
    private Category category;
    
    @NotBlank(message = "Brand is required")
    private String brand;
    
    @NotNull
    private BigDecimal basePrice;
    
    @Enumerated(EnumType.STRING)
    private Season season;
    
    @Enumerated(EnumType.STRING)
    private Gender targetGender;
    
    private String material;
    
    private String careInstructions;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductVariant> variants = new ArrayList<>();
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Enums
    public enum Category {
        CLOTHING_MENS("Men's Clothing"),
        CLOTHING_WOMENS("Women's Clothing"),
        CLOTHING_KIDS("Kids' Clothing"),
        FOOTWEAR_MENS("Men's Footwear"),
        FOOTWEAR_WOMENS("Women's Footwear"),
        FOOTWEAR_KIDS("Kids' Footwear"),
        ACCESSORIES_BAGS("Bags & Purses"),
        ACCESSORIES_JEWELRY("Jewelry"),
        ACCESSORIES_WATCHES("Watches"),
        ACCESSORIES_BELTS("Belts"),
        ACCESSORIES_HATS("Hats & Caps"),
        ACCESSORIES_SUNGLASSES("Sunglasses"),
        ACCESSORIES_SCARVES("Scarves & Wraps");
        
        private final String displayName;
        
        Category(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum Season {
        SPRING("Spring"),
        SUMMER("Summer"),
        AUTUMN("Autumn"),
        WINTER("Winter"),
        ALL_SEASON("All Season");
        
        private final String displayName;
        
        Season(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum Gender {
        MALE("Male"),
        FEMALE("Female"),
        UNISEX("Unisex"),
        KIDS("Kids");
        
        private final String displayName;
        
        Gender(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    // Constructors
    public FashionProduct() {}
    
    public FashionProduct(String name, String description, Category category, String brand, 
                         BigDecimal basePrice, Season season, Gender targetGender) {
        this.name = name;
        this.sku = generateSku(name, category);
        this.description = description;
        this.category = category;
        this.brand = brand;
        this.basePrice = basePrice;
        this.season = season;
        this.targetGender = targetGender;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { 
        this.name = name;
        if (this.sku == null || this.sku.isEmpty()) {
            this.sku = generateSku(name, this.category);
        }
    }
    
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    
    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }
    
    public Season getSeason() { return season; }
    public void setSeason(Season season) { this.season = season; }
    
    public Gender getTargetGender() { return targetGender; }
    public void setTargetGender(Gender targetGender) { this.targetGender = targetGender; }
    
    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }
    
    public String getCareInstructions() { return careInstructions; }
    public void setCareInstructions(String careInstructions) { this.careInstructions = careInstructions; }
    
    public List<ProductVariant> getVariants() { return variants; }
    public void setVariants(List<ProductVariant> variants) { this.variants = variants; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Helper methods
    public int getTotalStock() {
        return variants.stream().mapToInt(ProductVariant::getQuantity).sum();
    }
    
    public int getTotalMinStock() {
        return variants.stream().mapToInt(ProductVariant::getMinStockLevel).sum();
    }
    
    public boolean isLowStock() {
        return getTotalStock() <= getTotalMinStock();
    }
    
    public boolean isOutOfStock() {
        return getTotalStock() == 0;
    }
    
    // Helper method to generate SKU
    private String generateSku(String name, Category category) {
        if (name == null || name.isEmpty()) {
            return "FSH-" + System.currentTimeMillis();
        }
        
        String categoryPrefix = category != null ? category.name().substring(0, 3) : "FSH";
        String namePrefix = name.toUpperCase()
                .replaceAll("[^A-Z0-9]", "")
                .substring(0, Math.min(name.length(), 5));
        
        return categoryPrefix + "-" + namePrefix + "-" + (System.currentTimeMillis() % 10000);
    }
}