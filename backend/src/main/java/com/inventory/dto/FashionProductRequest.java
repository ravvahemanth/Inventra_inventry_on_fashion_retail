package com.inventory.dto;

import com.inventory.model.FashionProduct;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.List;

public class FashionProductRequest {
    
    @NotBlank(message = "Product name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Category is required")
    private FashionProduct.Category category;
    
    @NotBlank(message = "Brand is required")
    private String brand;
    
    @NotNull(message = "Base price is required")
    @Positive(message = "Base price must be positive")
    private BigDecimal basePrice;
    
    @NotNull(message = "Season is required")
    private FashionProduct.Season season;
    
    @NotNull(message = "Target gender is required")
    private FashionProduct.Gender targetGender;
    
    private String material;
    
    private String careInstructions;
    
    private List<ProductVariantRequest> variants;
    
    // Constructors
    public FashionProductRequest() {}
    
    public FashionProductRequest(String name, String description, FashionProduct.Category category,
                               String brand, BigDecimal basePrice, FashionProduct.Season season,
                               FashionProduct.Gender targetGender) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.brand = brand;
        this.basePrice = basePrice;
        this.season = season;
        this.targetGender = targetGender;
    }
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public FashionProduct.Category getCategory() { return category; }
    public void setCategory(FashionProduct.Category category) { this.category = category; }
    
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    
    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }
    
    public FashionProduct.Season getSeason() { return season; }
    public void setSeason(FashionProduct.Season season) { this.season = season; }
    
    public FashionProduct.Gender getTargetGender() { return targetGender; }
    public void setTargetGender(FashionProduct.Gender targetGender) { this.targetGender = targetGender; }
    
    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }
    
    public String getCareInstructions() { return careInstructions; }
    public void setCareInstructions(String careInstructions) { this.careInstructions = careInstructions; }
    
    public List<ProductVariantRequest> getVariants() { return variants; }
    public void setVariants(List<ProductVariantRequest> variants) { this.variants = variants; }
}