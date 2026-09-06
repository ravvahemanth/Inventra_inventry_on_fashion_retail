package com.inventory.service;

import com.inventory.dto.*;
import com.inventory.model.FashionProduct;
import com.inventory.model.ProductVariant;
import com.inventory.repository.FashionProductRepository;
import com.inventory.repository.ProductVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Month;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FashionProductService {
    
    @Autowired
    private FashionProductRepository fashionProductRepository;
    
    @Autowired
    private ProductVariantRepository productVariantRepository;
    
    @Autowired
    private AlertService alertService;
    
    @Autowired
    private FashionAlertService fashionAlertService;
    
    /**
     * Get all fashion products with variants eagerly loaded
     */
    @Transactional(readOnly = true)
    public List<FashionProductResponse> getAllProducts() {
        System.out.println("🔍 Fetching all fashion products with variants...");
        List<FashionProduct> products = fashionProductRepository.findAllByOrderByCreatedAtDesc();
        
        // Force load variants for each product to avoid lazy loading issues
        products.forEach(product -> {
            product.getVariants().size(); // Force lazy loading
            int totalStock = product.getTotalStock();
            boolean lowStock = product.isLowStock();
            boolean outOfStock = product.isOutOfStock();
            System.out.println("  - " + product.getName() + 
                             " | Total Stock: " + totalStock + 
                             " | Low Stock: " + lowStock + 
                             " | Out of Stock: " + outOfStock);
        });
        
        System.out.println("✅ Loaded " + products.size() + " products with variants");
        
        return products.stream()
                .map(FashionProductResponse::new)
                .collect(Collectors.toList());
    }

    
    /**
     * Get product by ID
     */
    public FashionProductResponse getProductById(Long id) {
        FashionProduct product = fashionProductRepository.findByIdWithVariants(id)
                .orElseThrow(() -> new RuntimeException("Fashion product not found with ID: " + id));
        return new FashionProductResponse(product);
    }
    
    /**
     * Get product by SKU
     */
    public FashionProductResponse getProductBySku(String sku) {
        FashionProduct product = fashionProductRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Fashion product not found with SKU: " + sku));
        return new FashionProductResponse(product);
    }
    
    /**
     * Create new fashion product with variants
     */
    public FashionProductResponse createProduct(FashionProductRequest request) {
        // Create the main product
        FashionProduct product = new FashionProduct(
                request.getName(),
                request.getDescription(),
                request.getCategory(),
                request.getBrand(),
                request.getBasePrice(),
                request.getSeason(),
                request.getTargetGender()
        );
        
        product.setMaterial(request.getMaterial());
        product.setCareInstructions(request.getCareInstructions());
        
        // Save the product first
        FashionProduct savedProduct = fashionProductRepository.save(product);
        
        // Create variants if provided
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (ProductVariantRequest variantRequest : request.getVariants()) {
                ProductVariant variant = new ProductVariant(
                        savedProduct,
                        variantRequest.getSize(),
                        variantRequest.getColor(),
                        variantRequest.getQuantity(),
                        variantRequest.getMinStockLevel(),
                        variantRequest.getPriceAdjustment()
                );
                
                productVariantRepository.save(variant);
                
                // Check for alerts on the variant using FashionAlertService
                if (variant.isLowStock() || variant.isOutOfStock()) {
                    fashionAlertService.checkAndCreateVariantAlerts(variant);
                }
            }
        }
        
        // Reload the product with variants
        return getProductById(savedProduct.getId());
    }
    
    /**
     * Update fashion product
     */
    public FashionProductResponse updateProduct(Long id, FashionProductRequest request) {
        FashionProduct product = fashionProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fashion product not found with ID: " + id));
        
        // Update product fields
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setBrand(request.getBrand());
        product.setBasePrice(request.getBasePrice());
        product.setSeason(request.getSeason());
        product.setTargetGender(request.getTargetGender());
        product.setMaterial(request.getMaterial());
        product.setCareInstructions(request.getCareInstructions());
        
        FashionProduct savedProduct = fashionProductRepository.save(product);
        
        return new FashionProductResponse(savedProduct);
    }
    
    /**
     * Delete fashion product
     */
    public void deleteProduct(Long id) {
        FashionProduct product = fashionProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fashion product not found with ID: " + id));
        
        fashionProductRepository.delete(product);
    }
    
    /**
     * Get products by category
     */
    public List<FashionProductResponse> getProductsByCategory(FashionProduct.Category category) {
        return fashionProductRepository.findByCategory(category)
                .stream()
                .map(FashionProductResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get products by brand
     */
    public List<FashionProductResponse> getProductsByBrand(String brand) {
        return fashionProductRepository.findByBrandIgnoreCase(brand)
                .stream()
                .map(FashionProductResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get products by season
     */
    public List<FashionProductResponse> getProductsBySeason(FashionProduct.Season season) {
        return fashionProductRepository.findBySeason(season)
                .stream()
                .map(FashionProductResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get seasonal products for current season
     */
    public List<FashionProductResponse> getCurrentSeasonProducts() {
        FashionProduct.Season currentSeason = getCurrentSeason();
        return fashionProductRepository.findSeasonalProducts(currentSeason)
                .stream()
                .map(FashionProductResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get products by gender
     */
    public List<FashionProductResponse> getProductsByGender(FashionProduct.Gender gender) {
        return fashionProductRepository.findByTargetGender(gender)
                .stream()
                .map(FashionProductResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Search products by name
     */
    public List<FashionProductResponse> searchProducts(String searchTerm) {
        return fashionProductRepository.findByNameContainingIgnoreCase(searchTerm)
                .stream()
                .map(FashionProductResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get products by price range
     */
    public List<FashionProductResponse> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return fashionProductRepository.findByPriceRange(minPrice, maxPrice)
                .stream()
                .map(FashionProductResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all fashion products (alias for getAllProducts)
     */
    public List<FashionProductResponse> getAllFashionProducts() {
        return getAllProducts();
    }
    
    /**
     * Get low stock fashion products (alias for getLowStockProducts)
     */
    public List<FashionProductResponse> getLowStockFashionProducts() {
        return getLowStockProducts();
    }
    
    /**
     * Get out of stock fashion products (alias for getOutOfStockProducts)
     */
    public List<FashionProductResponse> getOutOfStockFashionProducts() {
        return getOutOfStockProducts();
    }
    
    /**
     * Get low stock products
     */
    public List<FashionProductResponse> getLowStockProducts() {
        System.out.println("🔍 Fetching low stock products...");
        List<FashionProduct> lowStockProducts = fashionProductRepository.findLowStockProducts();
        System.out.println("📊 Database query returned " + lowStockProducts.size() + " low stock products");
        
        // Debug: Print each low stock product
        for (FashionProduct product : lowStockProducts) {
            System.out.println("  - " + product.getName() + " (Total Stock: " + product.getTotalStock() + 
                             ", Min Stock: " + product.getTotalMinStock() + ")");
            if (product.getVariants() != null) {
                for (ProductVariant variant : product.getVariants()) {
                    if (variant.getQuantity() > 0 && variant.getQuantity() <= variant.getMinStockLevel()) {
                        System.out.println("    ⚠️ Low variant: " + variant.getSizeDisplayName() + "/" + 
                                         variant.getColorDisplayName() + " - Qty: " + variant.getQuantity() + 
                                         " (Min: " + variant.getMinStockLevel() + ")");
                    }
                }
            }
        }
        
        return lowStockProducts.stream()
                .map(FashionProductResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get out of stock products
     */
    public List<FashionProductResponse> getOutOfStockProducts() {
        System.out.println("🔍 Fetching out of stock products...");
        List<FashionProduct> outOfStockProducts = fashionProductRepository.findOutOfStockProducts();
        System.out.println("📊 Database query returned " + outOfStockProducts.size() + " out of stock products");
        
        // Debug: Print each out of stock product
        for (FashionProduct product : outOfStockProducts) {
            System.out.println("  - " + product.getName() + " (Total Stock: " + product.getTotalStock() + ")");
        }
        
        return outOfStockProducts.stream()
                .map(FashionProductResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get trending products (recently added)
     */
    public List<FashionProductResponse> getTrendingProducts() {
        return fashionProductRepository.findTrendingProducts()
                .stream()
                .limit(20) // Top 20 trending products
                .map(FashionProductResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get available sizes for a product
     */
    public List<ProductVariant.Size> getAvailableSizes(Long productId) {
        FashionProduct product = fashionProductRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Fashion product not found with ID: " + productId));
        return productVariantRepository.findAvailableSizesByProduct(product);
    }
    
    /**
     * Get available colors for a product
     */
    public List<ProductVariant.Color> getAvailableColors(Long productId) {
        FashionProduct product = fashionProductRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Fashion product not found with ID: " + productId));
        return productVariantRepository.findAvailableColorsByProduct(product);
    }
    
    /**
     * Get available colors for a product and size
     */
    public List<ProductVariant.Color> getAvailableColors(Long productId, ProductVariant.Size size) {
        FashionProduct product = fashionProductRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Fashion product not found with ID: " + productId));
        return productVariantRepository.findAvailableColorsByProductAndSize(product, size);
    }
    
    /**
     * Get available sizes for a product and color
     */
    public List<ProductVariant.Size> getAvailableSizes(Long productId, ProductVariant.Color color) {
        FashionProduct product = fashionProductRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Fashion product not found with ID: " + productId));
        return productVariantRepository.findAvailableSizesByProductAndColor(product, color);
    }
    
    /**
     * Helper method to determine current season
     */
    private FashionProduct.Season getCurrentSeason() {
        Month currentMonth = LocalDate.now().getMonth();
        
        switch (currentMonth) {
            case MARCH, APRIL, MAY:
                return FashionProduct.Season.SPRING;
            case JUNE, JULY, AUGUST:
                return FashionProduct.Season.SUMMER;
            case SEPTEMBER, OCTOBER, NOVEMBER:
                return FashionProduct.Season.AUTUMN;
            case DECEMBER, JANUARY, FEBRUARY:
                return FashionProduct.Season.WINTER;
            default:
                return FashionProduct.Season.ALL_SEASON;
        }
    }
}