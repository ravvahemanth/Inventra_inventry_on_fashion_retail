package com.inventory.service;

import com.inventory.dto.StockTransactionResponse;
import com.inventory.model.StockTransaction;
import com.inventory.repository.StockTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private StockTransactionRepository stockTransactionRepository;

    // Get all transactions
    public List<StockTransactionResponse> getAllTransactions() {
        return stockTransactionRepository.findAll().stream()
                .map(StockTransactionResponse::new)
                .collect(Collectors.toList());
    }

    // Get transactions by type (STOCK_IN or STOCK_OUT)
    public List<StockTransactionResponse> getTransactionsByType(String type) {
        try {
            StockTransaction.TransactionType transactionType = StockTransaction.TransactionType.valueOf(type.toUpperCase());
            return stockTransactionRepository.findByTypeOrderByCreatedAtDesc(transactionType).stream()
                    .map(StockTransactionResponse::new)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid transaction type: " + type);
        }
    }

    // Get transactions in date range
    public List<StockTransactionResponse> getTransactionsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return stockTransactionRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(startDate, endDate).stream()
                .map(StockTransactionResponse::new)
                .collect(Collectors.toList());
    }

    // Get recent transactions
    public List<StockTransactionResponse> getRecentTransactions() {
        return stockTransactionRepository.findTop100ByOrderByCreatedAtDesc().stream()
                .map(StockTransactionResponse::new)
                .collect(Collectors.toList());
    }

    // Get transaction statistics
    public long getTotalTransactions() {
        return stockTransactionRepository.count();
    }
}
