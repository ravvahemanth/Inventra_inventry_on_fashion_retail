package com.inventory.dto;

import com.inventory.model.FashionProduct;
import com.inventory.model.ProductVariant;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class FashionProductResponse {
    
    private Long id;
    private String name;
    private String sku;
    private String description;
    private String category;
    private String categoryDisplayName;
    private String brand;
    private BigDecimal basePrice;
    private String season;
    private String seasonDisplayName;
    private String targetGender;
    private String genderDisplayName;
    private String material;
    private String careInstructions;
    private Integer totalStock;
    private Integer totalMinStock;
    private boolean lowStock;
    private boolean outOfStock;
    private List<ProductVariantResponse> variants;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public FashionProductResponse() {}
    
    public FashionProductResponse(FashionProduct product) {
        this.id = product.getId();
        this.name = product.getName();
        this.sku = product.getSku();
        this.description = product.getDescription();
        this.category = product.getCategory() != null ? product.getCategory().name() : null;
        this.categoryDisplayName = product.getCategory() != null ? product.getCategory().getDisplayName() : null;
        this.brand = product.getBrand();
        this.basePrice = product.getBasePrice();
        this.season = product.getSeason() != null ? product.getSeason().name() : null;
        this.seasonDisplayName = product.getSeason() != null ? product.getSeason().getDisplayName() : null;
        this.targetGender = product.getTargetGender() != null ? product.getTargetGender().name() : null;
        this.genderDisplayName = product.getTargetGender() != null ? product.getTargetGender().getDisplayName() : null;
        this.material = product.getMaterial();
        this.careInstructions = product.getCareInstructions();
        this.totalStock = product.getTotalStock();
        this.totalMinStock = product.getTotalMinStock();
        this.lowStock = product.isLowStock();
        this.outOfStock = product.isOutOfStock();
        this.variants = product.getVariants().stream()
                .map(ProductVariantResponse::new)
                .collect(Collectors.toList());
        this.createdAt = product.getCreatedAt();
        this.updatedAt = product.getUpdatedAt();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getCategoryDisplayName() { return categoryDisplayName; }
    public void setCategoryDisplayName(String categoryDisplayName) { this.categoryDisplayName = categoryDisplayName; }
    
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    
    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }
    
    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }
    
    public String getSeasonDisplayName() { return seasonDisplayName; }
    public void setSeasonDisplayName(String seasonDisplayName) { this.seasonDisplayName = seasonDisplayName; }
    
    public String getTargetGender() { return targetGender; }
    public void setTargetGender(String targetGender) { this.targetGender = targetGender; }
    
    public String getGenderDisplayName() { return genderDisplayName; }
    public void setGenderDisplayName(String genderDisplayName) { this.genderDisplayName = genderDisplayName; }
    
    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }
    
    public String getCareInstructions() { return careInstructions; }
    public void setCareInstructions(String careInstructions) { this.careInstructions = careInstructions; }
    
    public Integer getTotalStock() { return totalStock; }
    public void setTotalStock(Integer totalStock) { this.totalStock = totalStock; }
    
    public Integer getTotalMinStock() { return totalMinStock; }
    public void setTotalMinStock(Integer totalMinStock) { this.totalMinStock = totalMinStock; }
    
    public boolean isLowStock() { return lowStock; }
    public void setLowStock(boolean lowStock) { this.lowStock = lowStock; }
    
    public boolean isOutOfStock() { return outOfStock; }
    public void setOutOfStock(boolean outOfStock) { this.outOfStock = outOfStock; }
    
    public List<ProductVariantResponse> getVariants() { return variants; }
    public void setVariants(List<ProductVariantResponse> variants) { this.variants = variants; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}