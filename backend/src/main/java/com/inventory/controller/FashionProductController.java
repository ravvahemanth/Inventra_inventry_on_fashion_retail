package com.inventory.controller;

import com.inventory.dto.*;
import com.inventory.model.FashionProduct;
import com.inventory.model.ProductVariant;
import com.inventory.service.FashionProductService;
import com.inventory.service.StockTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/fashion-products")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class FashionProductController {
    
    @Autowired
    private FashionProductService fashionProductService;
    
    @Autowired
    private StockTransactionService stockTransactionService;
    
    /**
     * Get all fashion products
     * GET /api/fashion-products
     */
    @GetMapping
    public ResponseEntity<List<FashionProductResponse>> getAllProducts() {
        try {
            List<FashionProductResponse> products = fashionProductService.getAllProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get product by ID
     * GET /api/fashion-products/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<FashionProductResponse> getProductById(@PathVariable Long id) {
        try {
            FashionProductResponse product = fashionProductService.getProductById(id);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get product by SKU
     * GET /api/fashion-products/sku/{sku}
     */
    @GetMapping("/sku/{sku}")
    public ResponseEntity<FashionProductResponse> getProductBySku(@PathVariable String sku) {
        try {
            FashionProductResponse product = fashionProductService.getProductBySku(sku);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Create new fashion product
     * POST /api/fashion-products
     * Only ADMIN and MANAGER can create products
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<FashionProductResponse> createProduct(@Valid @RequestBody FashionProductRequest request) {
        try {
            FashionProductResponse product = fashionProductService.createProduct(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(product);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update fashion product
     * PUT /api/fashion-products/{id}
     * Only ADMIN and MANAGER can update products
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<FashionProductResponse> updateProduct(@PathVariable Long id, 
                                                              @Valid @RequestBody FashionProductRequest request) {
        try {
            FashionProductResponse product = fashionProductService.updateProduct(id, request);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Delete fashion product
     * DELETE /api/fashion-products/{id}
     * Only ADMIN can delete products
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        try {
            fashionProductService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get products by category
     * GET /api/fashion-products/category/{category}
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<FashionProductResponse>> getProductsByCategory(@PathVariable String category) {
        try {
            FashionProduct.Category categoryEnum = FashionProduct.Category.valueOf(category.toUpperCase());
            List<FashionProductResponse> products = fashionProductService.getProductsByCategory(categoryEnum);
            return ResponseEntity.ok(products);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get products by brand
     * GET /api/fashion-products/brand/{brand}
     */
    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<FashionProductResponse>> getProductsByBrand(@PathVariable String brand) {
        try {
            List<FashionProductResponse> products = fashionProductService.getProductsByBrand(brand);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get products by season
     * GET /api/fashion-products/season/{season}
     */
    @GetMapping("/season/{season}")
    public ResponseEntity<List<FashionProductResponse>> getProductsBySeason(@PathVariable String season) {
        try {
            FashionProduct.Season seasonEnum = FashionProduct.Season.valueOf(season.toUpperCase());
            List<FashionProductResponse> products = fashionProductService.getProductsBySeason(seasonEnum);
            return ResponseEntity.ok(products);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get current season products
     * GET /api/fashion-products/current-season
     */
    @GetMapping("/current-season")
    public ResponseEntity<List<FashionProductResponse>> getCurrentSeasonProducts() {
        try {
            List<FashionProductResponse> products = fashionProductService.getCurrentSeasonProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get products by gender
     * GET /api/fashion-products/gender/{gender}
     */
    @GetMapping("/gender/{gender}")
    public ResponseEntity<List<FashionProductResponse>> getProductsByGender(@PathVariable String gender) {
        try {
            FashionProduct.Gender genderEnum = FashionProduct.Gender.valueOf(gender.toUpperCase());
            List<FashionProductResponse> products = fashionProductService.getProductsByGender(genderEnum);
            return ResponseEntity.ok(products);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Search products
     * GET /api/fashion-products/search?q={searchTerm}
     */
    @GetMapping("/search")
    public ResponseEntity<List<FashionProductResponse>> searchProducts(@RequestParam("q") String searchTerm) {
        try {
            List<FashionProductResponse> products = fashionProductService.searchProducts(searchTerm);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get products by price range
     * GET /api/fashion-products/price-range?min={minPrice}&max={maxPrice}
     */
    @GetMapping("/price-range")
    public ResponseEntity<List<FashionProductResponse>> getProductsByPriceRange(
            @RequestParam("min") BigDecimal minPrice,
            @RequestParam("max") BigDecimal maxPrice) {
        try {
            List<FashionProductResponse> products = fashionProductService.getProductsByPriceRange(minPrice, maxPrice);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get low stock products
     * GET /api/fashion-products/low-stock
     */
    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<FashionProductResponse>> getLowStockProducts() {
        try {
            List<FashionProductResponse> products = fashionProductService.getLowStockProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get out of stock products
     * GET /api/fashion-products/out-of-stock
     */
    @GetMapping("/out-of-stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<FashionProductResponse>> getOutOfStockProducts() {
        try {
            List<FashionProductResponse> products = fashionProductService.getOutOfStockProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get trending products
     * GET /api/fashion-products/trending
     */
    @GetMapping("/trending")
    public ResponseEntity<List<FashionProductResponse>> getTrendingProducts() {
        try {
            List<FashionProductResponse> products = fashionProductService.getTrendingProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get available sizes for a product
     * GET /api/fashion-products/{id}/sizes
     */
    @GetMapping("/{id}/sizes")
    public ResponseEntity<List<ProductVariant.Size>> getAvailableSizes(@PathVariable Long id) {
        try {
            List<ProductVariant.Size> sizes = fashionProductService.getAvailableSizes(id);
            return ResponseEntity.ok(sizes);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get available colors for a product
     * GET /api/fashion-products/{id}/colors
     */
    @GetMapping("/{id}/colors")
    public ResponseEntity<List<ProductVariant.Color>> getAvailableColors(@PathVariable Long id) {
        try {
            List<ProductVariant.Color> colors = fashionProductService.getAvailableColors(id);
            return ResponseEntity.ok(colors);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get available colors for a product and size
     * GET /api/fashion-products/{id}/colors?size={size}
     */
    @GetMapping("/{id}/colors-by-size")
    public ResponseEntity<List<ProductVariant.Color>> getAvailableColorsBySize(
            @PathVariable Long id, 
            @RequestParam("size") String size) {
        try {
            ProductVariant.Size sizeEnum = ProductVariant.Size.valueOf(size.toUpperCase());
            List<ProductVariant.Color> colors = fashionProductService.getAvailableColors(id, sizeEnum);
            return ResponseEntity.ok(colors);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get available sizes for a product and color
     * GET /api/fashion-products/{id}/sizes-by-color?color={color}
     */
    @GetMapping("/{id}/sizes-by-color")
    public ResponseEntity<List<ProductVariant.Size>> getAvailableSizesByColor(
            @PathVariable Long id, 
            @RequestParam("color") String color) {
        try {
            ProductVariant.Color colorEnum = ProductVariant.Color.valueOf(color.toUpperCase());
            List<ProductVariant.Size> sizes = fashionProductService.getAvailableSizes(id, colorEnum);
            return ResponseEntity.ok(sizes);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Update fashion product variant stock
     * POST /api/fashion-products/{id}/variants/{variantId}/stock
     * Only ADMIN and MANAGER can update stock
     */
    @PostMapping("/{id}/variants/{variantId}/stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<StockTransactionResponse> updateVariantStock(
            @PathVariable Long id,
            @PathVariable Long variantId,
            @RequestBody StockTransactionRequest request) {
        try {
            // Set the fashion product and variant IDs
            request.setFashionProductId(id);
            request.setVariantId(variantId);
            
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            StockTransactionResponse response = stockTransactionService.createStockTransaction(request, username);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get stock transactions for a fashion product
     * GET /api/fashion-products/{id}/transactions
     */
    @GetMapping("/{id}/transactions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<StockTransactionResponse>> getFashionProductTransactions(@PathVariable Long id) {
        try {
            List<StockTransactionResponse> transactions = stockTransactionService.getTransactionsByFashionProduct(id);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}