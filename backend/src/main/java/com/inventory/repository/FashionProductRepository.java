package com.inventory.repository;

import com.inventory.model.FashionProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FashionProductRepository extends JpaRepository<FashionProduct, Long> {
    
    // Find by SKU
    Optional<FashionProduct> findBySku(String sku);
    
    // Find by name (case insensitive)
    Optional<FashionProduct> findByNameIgnoreCase(String name);
    
    // Find by category
    List<FashionProduct> findByCategory(FashionProduct.Category category);
    
    // Find by brand
    List<FashionProduct> findByBrandIgnoreCase(String brand);
    
    // Find by season
    List<FashionProduct> findBySeason(FashionProduct.Season season);
    
    // Find by target gender
    List<FashionProduct> findByTargetGender(FashionProduct.Gender targetGender);
    
    // Find by category and season (for seasonal collections)
    List<FashionProduct> findByCategoryAndSeason(FashionProduct.Category category, FashionProduct.Season season);
    
    // Find by brand and category
    List<FashionProduct> findByBrandIgnoreCaseAndCategory(String brand, FashionProduct.Category category);
    
    // Find all ordered by creation date (newest first)
    List<FashionProduct> findAllByOrderByCreatedAtDesc();
    
    // Find products with low stock (using custom query)
    @Query("SELECT DISTINCT p FROM FashionProduct p JOIN p.variants v WHERE v.quantity <= v.minStockLevel")
    List<FashionProduct> findLowStockProducts();
    
    // Find products that are out of stock
    @Query("SELECT DISTINCT p FROM FashionProduct p WHERE NOT EXISTS (SELECT v FROM ProductVariant v WHERE v.product = p AND v.quantity > 0)")
    List<FashionProduct> findOutOfStockProducts();
    
    // Find products by name containing (search functionality)
    List<FashionProduct> findByNameContainingIgnoreCase(String name);
    
    // Find products by description containing
    List<FashionProduct> findByDescriptionContainingIgnoreCase(String description);
    
    // Count total products
    @Query("SELECT COUNT(p) FROM FashionProduct p")
    Long getTotalProductCount();
    
    // Get total stock across all products
    @Query("SELECT COALESCE(SUM(v.quantity), 0) FROM ProductVariant v")
    Long getTotalStockQuantity();
    
    // Find products by multiple categories
    List<FashionProduct> findByCategoryIn(List<FashionProduct.Category> categories);
    
    // Find products by price range
    @Query("SELECT p FROM FashionProduct p WHERE p.basePrice BETWEEN :minPrice AND :maxPrice")
    List<FashionProduct> findByPriceRange(@Param("minPrice") java.math.BigDecimal minPrice, 
                                         @Param("maxPrice") java.math.BigDecimal maxPrice);
    
    // Find seasonal products for current season
    @Query("SELECT p FROM FashionProduct p WHERE p.season = :season OR p.season = 'ALL_SEASON'")
    List<FashionProduct> findSeasonalProducts(@Param("season") FashionProduct.Season season);
    
    // Find trending products (most recently added)
    @Query("SELECT p FROM FashionProduct p ORDER BY p.createdAt DESC")
    List<FashionProduct> findTrendingProducts();
}