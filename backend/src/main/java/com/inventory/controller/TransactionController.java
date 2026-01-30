package com.inventory.controller;

import com.inventory.dto.ApiResponse;
import com.inventory.dto.StockTransactionResponse;
import com.inventory.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // Get all transactions
    @GetMapping
    public ResponseEntity<ApiResponse<List<StockTransactionResponse>>> getAllTransactions() {
        try {
            List<StockTransactionResponse> transactions = transactionService.getAllTransactions();
            return ResponseEntity.ok(ApiResponse.success("Transactions fetched successfully", transactions));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch transactions: " + e.getMessage()));
        }
    }

    // Get transactions by type
    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<StockTransactionResponse>>> getTransactionsByType(@PathVariable String type) {
        try {
            List<StockTransactionResponse> transactions = transactionService.getTransactionsByType(type);
            return ResponseEntity.ok(ApiResponse.success("Transactions of type " + type + " fetched successfully", transactions));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch transactions: " + e.getMessage()));
        }
    }

    // Get transactions by date range
    @GetMapping("/date-range")
    public ResponseEntity<ApiResponse<List<StockTransactionResponse>>> getTransactionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        try {
            List<StockTransactionResponse> transactions = transactionService.getTransactionsByDateRange(startDate, endDate);
            return ResponseEntity.ok(ApiResponse.success("Transactions in date range fetched successfully", transactions));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch transactions: " + e.getMessage()));
        }
    }

    // Get recent transactions
    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<StockTransactionResponse>>> getRecentTransactions() {
        try {
            List<StockTransactionResponse> transactions = transactionService.getRecentTransactions();
            return ResponseEntity.ok(ApiResponse.success("Recent transactions fetched successfully", transactions));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch recent transactions: " + e.getMessage()));
        }
    }

    // Get transaction statistics
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatistics() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalTransactions", transactionService.getTotalTransactions());
            return ResponseEntity.ok(ApiResponse.success("Statistics fetched successfully", stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch statistics: " + e.getMessage()));
        }
    }
}
