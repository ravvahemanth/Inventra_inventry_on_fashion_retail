package com.inventory.repository;

import com.inventory.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByProductId(Long productId);
    
    List<Transaction> findByUserId(Long userId);
    
    List<Transaction> findByType(Transaction.TransactionType type);
    
    Page<Transaction> findByProductId(Long productId, Pageable pageable);
    
    Page<Transaction> findByType(Transaction.TransactionType type, Pageable pageable);
    
    @Query("SELECT t FROM Transaction t WHERE " +
           "(:productId IS NULL OR t.product.id = :productId) AND " +
           "(:type IS NULL OR t.type = :type)")
    Page<Transaction> findTransactionsWithFilters(@Param("productId") Long productId,
                                                 @Param("type") Transaction.TransactionType type,
                                                 Pageable pageable);
    
    @Query("SELECT t FROM Transaction t WHERE t.createdAt >= :startDate")
    List<Transaction> findRecentTransactions(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.createdAt >= :startDate")
    long countRecentTransactions(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT t.type, COUNT(t), SUM(t.quantity) FROM Transaction t " +
           "WHERE t.createdAt >= :startDate GROUP BY t.type")
    List<Object[]> getTransactionStatistics(@Param("startDate") LocalDateTime startDate);
}