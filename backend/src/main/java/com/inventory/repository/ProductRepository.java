package com.inventory.repository;

import com.inventory.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Optional<Product> findByName(String name);
    
    List<Product> findByCategory(String category);
    
    @Query("SELECT p FROM Product p WHERE p.quantity <= p.minStockLevel")
    List<Product> findLowStockProducts();
    
    @Query("SELECT p FROM Product p WHERE p.quantity = 0")
    List<Product> findOutOfStockProducts();
    
    @Query("SELECT COUNT(p) FROM Product p")
    long getTotalProductCount();
    
    @Query("SELECT COALESCE(SUM(p.quantity), 0) FROM Product p")
    long getTotalStockQuantity();
    
    boolean existsByName(String name);
    
    boolean existsBySku(String sku);
    
    Optional<Product> findBySku(String sku);
    
    // Order products by creation date (newest first)
    List<Product> findAllByOrderByCreatedAtDesc();
}