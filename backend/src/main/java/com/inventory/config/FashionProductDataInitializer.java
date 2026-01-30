package com.inventory.config;

import com.inventory.model.FashionProduct;
import com.inventory.model.ProductVariant;
import com.inventory.repository.FashionProductRepository;
import com.inventory.repository.ProductVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

// @Component
@Order(4) // Run after other initializers
public class FashionProductDataInitializer implements CommandLineRunner {
    
    @Autowired
    private FashionProductRepository fashionProductRepository;
    
    @Autowired
    private ProductVariantRepository productVariantRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (fashionProductRepository.count() == 0) {
            System.out.println("👗 Creating Fashion Products and Variants...");
            createFashionProducts();
            System.out.println("✅ Fashion Products Created Successfully!");
        } else {
            System.out.println("✅ Fashion Products Already Exist");
        }
    }
    
    private void createFashionProducts() {
        // 1. Premium Cotton T-Shirt
        FashionProduct tshirt = createFashionProduct(
            "Premium Cotton T-Shirt",
            "TSHIRT-COTTON-001",
            "Soft, breathable cotton t-shirt perfect for everyday wear",
            FashionProduct.Category.CLOTHING_MENS,
            "StyleCraft",
            new BigDecimal("899.00"),
            FashionProduct.Season.ALL_SEASON,
            FashionProduct.Gender.UNISEX,
            "100% Cotton",
            "Machine wash cold, tumble dry low"
        );
        
        createVariants(tshirt, Arrays.asList(
            new VariantData(ProductVariant.Size.S, ProductVariant.Color.BLACK, 25, 5),
            new VariantData(ProductVariant.Size.M, ProductVariant.Color.BLACK, 30, 5),
            new VariantData(ProductVariant.Size.L, ProductVariant.Color.BLACK, 20, 5),
            new VariantData(ProductVariant.Size.S, ProductVariant.Color.WHITE, 20, 5),
            new VariantData(ProductVariant.Size.M, ProductVariant.Color.WHITE, 35, 5),
            new VariantData(ProductVariant.Size.L, ProductVariant.Color.WHITE, 25, 5),
            new VariantData(ProductVariant.Size.S, ProductVariant.Color.NAVY, 15, 5),
            new VariantData(ProductVariant.Size.M, ProductVariant.Color.NAVY, 20, 5)
        ));
        
        // 2. Elegant Evening Dress
        FashionProduct dress = createFashionProduct(
            "Elegant Evening Dress",
            "DRESS-EVENING-001",
            "Sophisticated evening dress perfect for special occasions",
            FashionProduct.Category.CLOTHING_WOMENS,
            "Glamour Collection",
            new BigDecimal("2499.00"),
            FashionProduct.Season.ALL_SEASON,
            FashionProduct.Gender.FEMALE,
            "Polyester blend with satin finish",
            "Dry clean only"
        );
        
        createVariants(dress, Arrays.asList(
            new VariantData(ProductVariant.Size.S, ProductVariant.Color.BLACK, 12, 3),
            new VariantData(ProductVariant.Size.M, ProductVariant.Color.BLACK, 15, 3),
            new VariantData(ProductVariant.Size.L, ProductVariant.Color.BLACK, 10, 3),
            new VariantData(ProductVariant.Size.S, ProductVariant.Color.NAVY, 8, 3),
            new VariantData(ProductVariant.Size.M, ProductVariant.Color.NAVY, 12, 3),
            new VariantData(ProductVariant.Size.S, ProductVariant.Color.BURGUNDY, 6, 3),
            new VariantData(ProductVariant.Size.M, ProductVariant.Color.BURGUNDY, 8, 3)
        ));
        
        // 3. Kids Cartoon T-Shirt
        FashionProduct kidsTshirt = createFashionProduct(
            "Kids Cartoon T-Shirt",
            "KIDS-TSHIRT-001",
            "Fun cartoon-themed t-shirt for children",
            FashionProduct.Category.CLOTHING_KIDS,
            "Little Stars",
            new BigDecimal("599.00"),
            FashionProduct.Season.ALL_SEASON,
            FashionProduct.Gender.KIDS,
            "100% Cotton",
            "Machine wash warm, tumble dry low"
        );
        
        createVariants(kidsTshirt, Arrays.asList(
            new VariantData(ProductVariant.Size.KIDS_S, ProductVariant.Color.BLUE, 20, 5),
            new VariantData(ProductVariant.Size.KIDS_M, ProductVariant.Color.BLUE, 25, 5),
            new VariantData(ProductVariant.Size.KIDS_L, ProductVariant.Color.BLUE, 15, 5),
            new VariantData(ProductVariant.Size.KIDS_S, ProductVariant.Color.RED, 18, 5),
            new VariantData(ProductVariant.Size.KIDS_M, ProductVariant.Color.RED, 22, 5),
            new VariantData(ProductVariant.Size.KIDS_S, ProductVariant.Color.GREEN, 12, 5)
        ));
        
        // 4. Running Sports Shoes
        FashionProduct runningShoes = createFashionProduct(
            "Running Sports Shoes",
            "SHOES-RUNNING-001",
            "Lightweight running shoes with excellent cushioning",
            FashionProduct.Category.FOOTWEAR_MENS,
            "SportMax",
            new BigDecimal("3499.00"),
            FashionProduct.Season.ALL_SEASON,
            FashionProduct.Gender.UNISEX,
            "Mesh upper with rubber sole",
            "Wipe clean with damp cloth"
        );
        
        createVariants(runningShoes, Arrays.asList(
            new VariantData(ProductVariant.Size.SIZE_8, ProductVariant.Color.BLACK, 15, 3),
            new VariantData(ProductVariant.Size.SIZE_9, ProductVariant.Color.BLACK, 20, 3),
            new VariantData(ProductVariant.Size.SIZE_10, ProductVariant.Color.BLACK, 18, 3),
            new VariantData(ProductVariant.Size.SIZE_8, ProductVariant.Color.WHITE, 12, 3),
            new VariantData(ProductVariant.Size.SIZE_9, ProductVariant.Color.WHITE, 16, 3),
            new VariantData(ProductVariant.Size.SIZE_10, ProductVariant.Color.WHITE, 14, 3),
            new VariantData(ProductVariant.Size.SIZE_9, ProductVariant.Color.BLUE, 10, 3)
        ));
        
        // 5. Designer Handbag
        FashionProduct handbag = createFashionProduct(
            "Designer Handbag",
            "BAG-DESIGNER-001",
            "Elegant designer handbag with premium finish",
            FashionProduct.Category.ACCESSORIES_BAGS,
            "LuxeStyle",
            new BigDecimal("4999.00"),
            FashionProduct.Season.ALL_SEASON,
            FashionProduct.Gender.FEMALE,
            "Genuine leather with gold hardware",
            "Clean with leather conditioner"
        );
        
        createVariants(handbag, Arrays.asList(
            new VariantData(ProductVariant.Size.MEDIUM, ProductVariant.Color.BLACK, 8, 2),
            new VariantData(ProductVariant.Size.MEDIUM, ProductVariant.Color.BROWN, 6, 2),
            new VariantData(ProductVariant.Size.MEDIUM, ProductVariant.Color.BEIGE, 5, 2),
            new VariantData(ProductVariant.Size.LARGE, ProductVariant.Color.BLACK, 4, 2),
            new VariantData(ProductVariant.Size.LARGE, ProductVariant.Color.BROWN, 3, 2)
        ));
        
        // 6. Classic Denim Jeans
        FashionProduct jeans = createFashionProduct(
            "Classic Denim Jeans",
            "JEANS-CLASSIC-001",
            "Timeless denim jeans with perfect fit",
            FashionProduct.Category.CLOTHING_MENS,
            "DenimCraft",
            new BigDecimal("1899.00"),
            FashionProduct.Season.ALL_SEASON,
            FashionProduct.Gender.UNISEX,
            "100% Cotton Denim",
            "Machine wash cold, hang dry"
        );
        
        createVariants(jeans, Arrays.asList(
            new VariantData(ProductVariant.Size.S, ProductVariant.Color.BLUE, 22, 5),
            new VariantData(ProductVariant.Size.M, ProductVariant.Color.BLUE, 28, 5),
            new VariantData(ProductVariant.Size.L, ProductVariant.Color.BLUE, 25, 5),
            new VariantData(ProductVariant.Size.XL, ProductVariant.Color.BLUE, 20, 5),
            new VariantData(ProductVariant.Size.M, ProductVariant.Color.BLACK, 15, 5),
            new VariantData(ProductVariant.Size.L, ProductVariant.Color.BLACK, 18, 5)
        ));
        
        // 7. Summer Floral Dress
        FashionProduct floralDress = createFashionProduct(
            "Summer Floral Dress",
            "DRESS-FLORAL-001",
            "Light and breezy floral dress perfect for summer",
            FashionProduct.Category.CLOTHING_WOMENS,
            "Summer Breeze",
            new BigDecimal("1599.00"),
            FashionProduct.Season.SUMMER,
            FashionProduct.Gender.FEMALE,
            "Cotton blend with floral print",
            "Machine wash cold, line dry"
        );
        
        createVariants(floralDress, Arrays.asList(
            new VariantData(ProductVariant.Size.S, ProductVariant.Color.FLORAL, 18, 4),
            new VariantData(ProductVariant.Size.M, ProductVariant.Color.FLORAL, 22, 4),
            new VariantData(ProductVariant.Size.L, ProductVariant.Color.FLORAL, 16, 4),
            new VariantData(ProductVariant.Size.XL, ProductVariant.Color.FLORAL, 12, 4)
        ));
        
        // 8. Winter Wool Sweater
        FashionProduct sweater = createFashionProduct(
            "Winter Wool Sweater",
            "SWEATER-WOOL-001",
            "Cozy wool sweater for cold weather",
            FashionProduct.Category.CLOTHING_MENS,
            "WarmWear",
            new BigDecimal("2299.00"),
            FashionProduct.Season.WINTER,
            FashionProduct.Gender.UNISEX,
            "100% Merino Wool",
            "Hand wash cold, lay flat to dry"
        );
        
        createVariants(sweater, Arrays.asList(
            new VariantData(ProductVariant.Size.M, ProductVariant.Color.GRAY, 14, 3),
            new VariantData(ProductVariant.Size.L, ProductVariant.Color.GRAY, 16, 3),
            new VariantData(ProductVariant.Size.XL, ProductVariant.Color.GRAY, 12, 3),
            new VariantData(ProductVariant.Size.M, ProductVariant.Color.NAVY, 10, 3),
            new VariantData(ProductVariant.Size.L, ProductVariant.Color.NAVY, 12, 3),
            new VariantData(ProductVariant.Size.M, ProductVariant.Color.BLACK, 8, 3)
        ));
        
        // 9. Kids School Shoes
        FashionProduct schoolShoes = createFashionProduct(
            "Kids School Shoes",
            "SHOES-SCHOOL-001",
            "Durable school shoes for children",
            FashionProduct.Category.FOOTWEAR_KIDS,
            "SchoolStep",
            new BigDecimal("1299.00"),
            FashionProduct.Season.ALL_SEASON,
            FashionProduct.Gender.KIDS,
            "Leather upper with rubber sole",
            "Wipe clean with damp cloth"
        );
        
        createVariants(schoolShoes, Arrays.asList(
            new VariantData(ProductVariant.Size.SIZE_5, ProductVariant.Color.BLACK, 20, 5),
            new VariantData(ProductVariant.Size.SIZE_6, ProductVariant.Color.BLACK, 25, 5),
            new VariantData(ProductVariant.Size.SIZE_7, ProductVariant.Color.BLACK, 22, 5),
            new VariantData(ProductVariant.Size.SIZE_8, ProductVariant.Color.BLACK, 18, 5),
            new VariantData(ProductVariant.Size.SIZE_6, ProductVariant.Color.BROWN, 15, 5),
            new VariantData(ProductVariant.Size.SIZE_7, ProductVariant.Color.BROWN, 12, 5)
        ));
        
        // 10. Fashion Watch
        FashionProduct watch = createFashionProduct(
            "Fashion Watch",
            "WATCH-FASHION-001",
            "Stylish fashion watch with leather strap",
            FashionProduct.Category.ACCESSORIES_WATCHES,
            "TimeStyle",
            new BigDecimal("2799.00"),
            FashionProduct.Season.ALL_SEASON,
            FashionProduct.Gender.UNISEX,
            "Stainless steel case with leather strap",
            "Water resistant, avoid extreme temperatures"
        );
        
        createVariants(watch, Arrays.asList(
            new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.BLACK, 12, 3),
            new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.BROWN, 10, 3),
            new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.SILVER, 8, 3),
            new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.GOLD, 6, 3)
        ));
        
        // Add some low stock items for testing alerts
        // 11. Limited Edition Sneakers (Low Stock)
        FashionProduct limitedSneakers = createFashionProduct(
            "Limited Edition Sneakers",
            "SNEAKERS-LIMITED-001",
            "Exclusive limited edition sneakers",
            FashionProduct.Category.FOOTWEAR_MENS,
            "ExclusiveStep",
            new BigDecimal("5999.00"),
            FashionProduct.Season.ALL_SEASON,
            FashionProduct.Gender.UNISEX,
            "Premium materials with unique design",
            "Clean with soft brush"
        );
        
        createVariants(limitedSneakers, Arrays.asList(
            new VariantData(ProductVariant.Size.SIZE_9, ProductVariant.Color.WHITE, 2, 5), // Low stock
            new VariantData(ProductVariant.Size.SIZE_10, ProductVariant.Color.WHITE, 1, 5), // Very low stock
            new VariantData(ProductVariant.Size.SIZE_11, ProductVariant.Color.WHITE, 0, 5) // Out of stock
        ));
        
        // 12. Designer Sunglasses (Low Stock)
        FashionProduct sunglasses = createFashionProduct(
            "Designer Sunglasses",
            "SUNGLASSES-DESIGNER-001",
            "Premium designer sunglasses with UV protection",
            FashionProduct.Category.ACCESSORIES_SUNGLASSES,
            "SunStyle",
            new BigDecimal("3299.00"),
            FashionProduct.Season.SUMMER,
            FashionProduct.Gender.UNISEX,
            "Acetate frame with polarized lenses",
            "Clean with microfiber cloth"
        );
        
        createVariants(sunglasses, Arrays.asList(
            new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.BLACK, 3, 10), // Low stock
            new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.BROWN, 1, 10), // Very low stock
            new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.GOLD, 0, 10) // Out of stock
        ));
    }
    
    private FashionProduct createFashionProduct(String name, String sku, String description,
                                              FashionProduct.Category category, String brand,
                                              BigDecimal basePrice, FashionProduct.Season season,
                                              FashionProduct.Gender gender, String material,
                                              String careInstructions) {
        FashionProduct product = new FashionProduct();
        product.setName(name);
        product.setSku(sku);
        product.setDescription(description);
        product.setCategory(category);
        product.setBrand(brand);
        product.setBasePrice(basePrice);
        product.setSeason(season);
        product.setTargetGender(gender);
        product.setMaterial(material);
        product.setCareInstructions(careInstructions);
        
        return fashionProductRepository.save(product);
    }
    
    private void createVariants(FashionProduct product, List<VariantData> variantDataList) {
        for (VariantData data : variantDataList) {
            ProductVariant variant = new ProductVariant();
            variant.setProduct(product);
            variant.setSize(data.size);
            variant.setColor(data.color);
            variant.setQuantity(data.quantity);
            variant.setMinStockLevel(data.minStockLevel);
            variant.setPriceAdjustment(BigDecimal.ZERO);
            
            productVariantRepository.save(variant);
        }
    }
    
    private static class VariantData {
        ProductVariant.Size size;
        ProductVariant.Color color;
        Integer quantity;
        Integer minStockLevel;
        
        VariantData(ProductVariant.Size size, ProductVariant.Color color, Integer quantity, Integer minStockLevel) {
            this.size = size;
            this.color = color;
            this.quantity = quantity;
            this.minStockLevel = minStockLevel;
        }
    }
}