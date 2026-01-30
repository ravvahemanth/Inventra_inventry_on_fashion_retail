package com.inventory.controller;

import com.inventory.dto.StockTransactionRequest;
import com.inventory.dto.StockTransactionResponse;
import com.inventory.service.StockTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-transactions")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class StockTransactionController {

    @Autowired
    private StockTransactionService stockTransactionService;

    /**
     * Get all stock transactions
     * GET /api/stock-transactions
     * Available for MANAGER and ADMIN roles
     */
    @GetMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<StockTransactionResponse>> getAllTransactions() {
        try {
            System.out.println("📋 GET /api/stock-transactions - Fetching all transactions");
            List<StockTransactionResponse> transactions = stockTransactionService.getAllTransactions();
            System.out.println("✅ Found " + transactions.size() + " transactions");
            
            // Print each transaction for debugging
            transactions.forEach(t -> System.out.println("  - " + t.getProductName() + " (" + t.getType() + ") x" + t.getQuantity()));
            
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            System.err.println("❌ Error fetching transactions: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get transactions by type
     * GET /api/stock-transactions/type/{type}
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<StockTransactionResponse>> getTransactionsByType(
            @PathVariable String type) {
        try {
            System.out.println("📋 GET /api/stock-transactions/type/" + type);
            List<StockTransactionResponse> transactions = stockTransactionService.getTransactionsByType(type);
            System.out.println("✅ Found " + transactions.size() + " " + type + " transactions");
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            System.err.println("❌ Error fetching transactions by type: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Get transactions by product
     * GET /api/stock-transactions/product/{productId}
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<StockTransactionResponse>> getTransactionsByProduct(
            @PathVariable Long productId) {
        try {
            System.out.println("📋 GET /api/stock-transactions/product/" + productId);
            List<StockTransactionResponse> transactions = stockTransactionService.getTransactionsByProduct(productId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            System.err.println("❌ Error fetching product transactions: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Get recent transactions
     * GET /api/stock-transactions/recent
     */
    @GetMapping("/recent")
    public ResponseEntity<List<StockTransactionResponse>> getRecentTransactions() {
        try {
            System.out.println("📋 GET /api/stock-transactions/recent");
            List<StockTransactionResponse> transactions = stockTransactionService.getRecentTransactions();
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            System.err.println("❌ Error fetching recent transactions: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Create a new stock transaction
     * POST /api/stock-transactions
     * Only MANAGER and ADMIN can create stock transactions
     */
    @PostMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<StockTransactionResponse> createTransaction(
            @RequestBody StockTransactionRequest request) {
        try {
            System.out.println("📝 POST /api/stock-transactions - Creating new transaction");
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            StockTransactionResponse response = stockTransactionService.createStockTransaction(request, username);
            System.out.println("✅ Transaction created with ID: " + response.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            System.err.println("❌ Error creating transaction: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    /**
     * Export transactions to CSV
     * GET /api/stock-transactions/export
     * Available for both MANAGER and ADMIN
     */
    @GetMapping("/export")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<String> exportTransactionsCSV(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        try {
            String csvContent = stockTransactionService.exportTransactionsToCSV(startDate, endDate);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            
            String fileName = "transactions_";
            if (startDate != null && endDate != null) {
                fileName += startDate + "_to_" + endDate;
            } else {
                fileName += java.time.LocalDate.now().toString();
            }
            fileName += ".csv";
            
            headers.setContentDispositionFormData("attachment", fileName);
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(csvContent);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error exporting transactions: " + e.getMessage());
        }
    }
}
