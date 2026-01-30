package com.inventory.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_variants")
public class ProductVariant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private FashionProduct product;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private Size size;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    private Color color;
    
    @NotNull
    @PositiveOrZero
    private Integer quantity;
    
    @NotNull
    @PositiveOrZero
    private Integer minStockLevel;
    
    private BigDecimal priceAdjustment; // Additional price for this variant (can be negative)
    
    @Column(unique = true)
    private String variantSku;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    // Enums
    public enum Size {
        // Clothing sizes
        XXS("XXS"), XS("XS"), S("S"), M("M"), L("L"), XL("XL"), XXL("XXL"), XXXL("XXXL"),
        
        // Shoe sizes (US)
        SIZE_5("5"), SIZE_5_5("5.5"), SIZE_6("6"), SIZE_6_5("6.5"), SIZE_7("7"), SIZE_7_5("7.5"),
        SIZE_8("8"), SIZE_8_5("8.5"), SIZE_9("9"), SIZE_9_5("9.5"), SIZE_10("10"), SIZE_10_5("10.5"),
        SIZE_11("11"), SIZE_11_5("11.5"), SIZE_12("12"), SIZE_13("13"), SIZE_14("14"),
        
        // Kids sizes
        KIDS_2T("2T"), KIDS_3T("3T"), KIDS_4T("4T"), KIDS_5T("5T"),
        KIDS_XS("Kids XS"), KIDS_S("Kids S"), KIDS_M("Kids M"), KIDS_L("Kids L"), KIDS_XL("Kids XL"),
        
        // One size fits all
        ONE_SIZE("One Size"),
        
        // Accessory sizes
        SMALL("Small"), MEDIUM("Medium"), LARGE("Large");
        
        private final String displayName;
        
        Size(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum Color {
        // Basic colors
        BLACK("Black"), WHITE("White"), GRAY("Gray"), NAVY("Navy"), BROWN("Brown"),
        
        // Vibrant colors
        RED("Red"), BLUE("Blue"), GREEN("Green"), YELLOW("Yellow"), ORANGE("Orange"),
        PURPLE("Purple"), PINK("Pink"), TURQUOISE("Turquoise"),
        
        // Fashion colors
        BEIGE("Beige"), CREAM("Cream"), IVORY("Ivory"), KHAKI("Khaki"), OLIVE("Olive"),
        BURGUNDY("Burgundy"), MAROON("Maroon"), TEAL("Teal"), CORAL("Coral"),
        
        // Metallic colors
        GOLD("Gold"), SILVER("Silver"), ROSE_GOLD("Rose Gold"),
        
        // Patterns and prints
        FLORAL("Floral"), STRIPED("Striped"), POLKA_DOT("Polka Dot"), PLAID("Plaid"),
        LEOPARD("Leopard Print"), ZEBRA("Zebra Print"),
        
        // Multi-color
        MULTICOLOR("Multicolor"), RAINBOW("Rainbow");
        
        private final String displayName;
        
        Color(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    // Constructors
    public ProductVariant() {}
    
    public ProductVariant(FashionProduct product, Size size, Color color, Integer quantity, 
                         Integer minStockLevel, BigDecimal priceAdjustment) {
        this.product = product;
        this.size = size;
        this.color = color;
        this.quantity = quantity;
        this.minStockLevel = minStockLevel;
        this.priceAdjustment = priceAdjustment;
        this.variantSku = generateVariantSku();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public FashionProduct getProduct() { return product; }
    public void setProduct(FashionProduct product) { 
        this.product = product;
        this.variantSku = generateVariantSku();
    }
    
    public Size getSize() { return size; }
    public void setSize(Size size) { 
        this.size = size;
        this.variantSku = generateVariantSku();
    }
    
    public Color getColor() { return color; }
    public void setColor(Color color) { 
        this.color = color;
        this.variantSku = generateVariantSku();
    }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public Integer getMinStockLevel() { return minStockLevel; }
    public void setMinStockLevel(Integer minStockLevel) { this.minStockLevel = minStockLevel; }
    
    public BigDecimal getPriceAdjustment() { return priceAdjustment; }
    public void setPriceAdjustment(BigDecimal priceAdjustment) { this.priceAdjustment = priceAdjustment; }
    
    public String getVariantSku() { return variantSku; }
    public void setVariantSku(String variantSku) { this.variantSku = variantSku; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Helper methods
    public boolean isLowStock() {
        return quantity <= minStockLevel;
    }
    
    public boolean isOutOfStock() {
        return quantity == 0;
    }
    
    public BigDecimal getFinalPrice() {
        BigDecimal basePrice = product != null ? product.getBasePrice() : BigDecimal.ZERO;
        BigDecimal adjustment = priceAdjustment != null ? priceAdjustment : BigDecimal.ZERO;
        return basePrice.add(adjustment);
    }
    
    public String getDisplayName() {
        return String.format("%s - %s/%s", 
            product != null ? product.getName() : "Unknown Product",
            size != null ? size.getDisplayName() : "Unknown Size",
            color != null ? color.getDisplayName() : "Unknown Color"
        );
    }
    
    public String getSizeDisplayName() {
        return size != null ? size.getDisplayName() : "Unknown Size";
    }
    
    public String getColorDisplayName() {
        return color != null ? color.getDisplayName() : "Unknown Color";
    }
    
    public String getSku() {
        return variantSku;
    }
    
    // Helper method to generate variant SKU
    private String generateVariantSku() {
        if (product == null || size == null || color == null) {
            return "VAR-" + System.currentTimeMillis();
        }
        
        String productSku = product.getSku() != null ? product.getSku() : "PROD";
        String sizeCode = size.name().length() > 3 ? size.name().substring(0, 3) : size.name();
        String colorCode = color.name().length() > 3 ? color.name().substring(0, 3) : color.name();
        
        return productSku + "-" + sizeCode + "-" + colorCode;
    }
}