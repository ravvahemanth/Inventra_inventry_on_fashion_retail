package com.inventory.repository;

import com.inventory.model.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockTransactionRepository extends JpaRepository<StockTransaction, Long> {
    
    // Regular product queries (legacy)
    List<StockTransaction> findByProductIdOrderByCreatedAtDesc(Long productId);
    
    // Fashion product queries (new)
    List<StockTransaction> findByFashionProductIdOrderByCreatedAtDesc(Long fashionProductId);
    
    List<StockTransaction> findByProductVariantIdOrderByCreatedAtDesc(Long variantId);
    
    // User queries
    List<StockTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Type queries
    List<StockTransaction> findByTypeOrderByCreatedAtDesc(StockTransaction.TransactionType type);
    
    // Date range queries
    List<StockTransaction> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime startDate, LocalDateTime endDate);
    
    // Recent transactions
    List<StockTransaction> findTop100ByOrderByCreatedAtDesc();
    
    List<StockTransaction> findTop10ByOrderByCreatedAtDesc();
    
    // Count queries
    long countByCreatedAtAfter(LocalDateTime date);
    
    // Custom queries for unified transaction view
    @Query("SELECT t FROM StockTransaction t WHERE " +
           "(t.product IS NOT NULL AND t.product.id = :productId) OR " +
           "(t.fashionProduct IS NOT NULL AND t.fashionProduct.id = :productId) " +
           "ORDER BY t.createdAt DESC")
    List<StockTransaction> findByAnyProductIdOrderByCreatedAtDesc(@Param("productId") Long productId);
    
    @Query("SELECT t FROM StockTransaction t WHERE " +
           "t.entityName LIKE %:searchTerm% OR " +
           "t.reason LIKE %:searchTerm% OR " +
           "t.variantDetails LIKE %:searchTerm% " +
           "ORDER BY t.createdAt DESC")
    List<StockTransaction> findBySearchTermOrderByCreatedAtDesc(@Param("searchTerm") String searchTerm);
}
