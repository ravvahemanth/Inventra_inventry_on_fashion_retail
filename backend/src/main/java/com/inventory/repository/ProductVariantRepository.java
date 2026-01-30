package com.inventory.repository;

import com.inventory.model.ProductVariant;
import com.inventory.model.FashionProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    
    // Find by variant SKU
    Optional<ProductVariant> findByVariantSku(String variantSku);
    
    // Find all variants for a product
    List<ProductVariant> findByProduct(FashionProduct product);
    
    // Find all variants for a product ordered by size and color
    List<ProductVariant> findByProductOrderBySizeAscColorAsc(FashionProduct product);
    
    // Find variants by product ID
    List<ProductVariant> findByProductId(Long productId);
    
    // Find variants by size
    List<ProductVariant> findBySize(ProductVariant.Size size);
    
    // Find variants by color
    List<ProductVariant> findByColor(ProductVariant.Color color);
    
    // Find variants by size and color
    List<ProductVariant> findBySizeAndColor(ProductVariant.Size size, ProductVariant.Color color);
    
    // Find specific variant for a product
    Optional<ProductVariant> findByProductAndSizeAndColor(FashionProduct product, 
                                                         ProductVariant.Size size, 
                                                         ProductVariant.Color color);
    
    // Find low stock variants
    @Query("SELECT v FROM ProductVariant v WHERE v.quantity <= v.minStockLevel")
    List<ProductVariant> findLowStockVariants();
    
    // Find out of stock variants
    List<ProductVariant> findByQuantity(Integer quantity);
    
    // Find out of stock variants (quantity = 0)
    @Query("SELECT v FROM ProductVariant v WHERE v.quantity = 0")
    List<ProductVariant> findOutOfStockVariants();
    
    // Find variants with stock above minimum
    @Query("SELECT v FROM ProductVariant v WHERE v.quantity > v.minStockLevel")
    List<ProductVariant> findWellStockedVariants();
    
    // Find variants by product category
    @Query("SELECT v FROM ProductVariant v WHERE v.product.category = :category")
    List<ProductVariant> findByProductCategory(@Param("category") FashionProduct.Category category);
    
    // Find variants by product season
    @Query("SELECT v FROM ProductVariant v WHERE v.product.season = :season")
    List<ProductVariant> findByProductSeason(@Param("season") FashionProduct.Season season);
    
    // Find variants by product brand
    @Query("SELECT v FROM ProductVariant v WHERE v.product.brand = :brand")
    List<ProductVariant> findByProductBrand(@Param("brand") String brand);
    
    // Get available sizes for a product
    @Query("SELECT DISTINCT v.size FROM ProductVariant v WHERE v.product = :product AND v.quantity > 0")
    List<ProductVariant.Size> findAvailableSizesByProduct(@Param("product") FashionProduct product);
    
    // Get available colors for a product
    @Query("SELECT DISTINCT v.color FROM ProductVariant v WHERE v.product = :product AND v.quantity > 0")
    List<ProductVariant.Color> findAvailableColorsByProduct(@Param("product") FashionProduct product);
    
    // Get available colors for a product and size
    @Query("SELECT DISTINCT v.color FROM ProductVariant v WHERE v.product = :product AND v.size = :size AND v.quantity > 0")
    List<ProductVariant.Color> findAvailableColorsByProductAndSize(@Param("product") FashionProduct product, 
                                                                  @Param("size") ProductVariant.Size size);
    
    // Get available sizes for a product and color
    @Query("SELECT DISTINCT v.size FROM ProductVariant v WHERE v.product = :product AND v.color = :color AND v.quantity > 0")
    List<ProductVariant.Size> findAvailableSizesByProductAndColor(@Param("product") FashionProduct product, 
                                                                 @Param("color") ProductVariant.Color color);
    
    // Count variants by product
    Long countByProduct(FashionProduct product);
    
    // Count variants in stock by product
    @Query("SELECT COUNT(v) FROM ProductVariant v WHERE v.product = :product AND v.quantity > 0")
    Long countInStockVariantsByProduct(@Param("product") FashionProduct product);
    
    // Find variants ordered by creation date (newest first)
    List<ProductVariant> findAllByOrderByCreatedAtDesc();
    
    // Find variants by quantity range
    @Query("SELECT v FROM ProductVariant v WHERE v.quantity BETWEEN :minQuantity AND :maxQuantity")
    List<ProductVariant> findByQuantityRange(@Param("minQuantity") Integer minQuantity, 
                                           @Param("maxQuantity") Integer maxQuantity);
}