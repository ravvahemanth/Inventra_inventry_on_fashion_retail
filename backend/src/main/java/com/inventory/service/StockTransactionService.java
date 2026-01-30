package com.inventory.service;

import com.inventory.dto.StockTransactionRequest;
import com.inventory.dto.StockTransactionResponse;
import com.inventory.model.FashionProduct;
import com.inventory.model.Product;
import com.inventory.model.ProductVariant;
import com.inventory.model.StockTransaction;
import com.inventory.model.User;
import com.inventory.repository.AlertRepository;
import com.inventory.repository.FashionProductRepository;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.ProductVariantRepository;
import com.inventory.repository.StockTransactionRepository;
import com.inventory.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockTransactionService {

    @Autowired
    private StockTransactionRepository stockTransactionRepository;

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private FashionProductRepository fashionProductRepository;
    
    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AlertService alertService;

    /**
     * Create a new stock transaction - supports both regular products and fashion products
     */
    @Transactional
    public StockTransactionResponse createStockTransaction(StockTransactionRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StockTransaction.TransactionType type = StockTransaction.TransactionType.valueOf(request.getType());
        StockTransaction transaction;

        if (request.isFashionProduct()) {
            // Handle fashion product variant transaction
            transaction = createFashionProductTransaction(request, type, user);
        } else if (request.isRegularProduct()) {
            // Handle regular product transaction (legacy)
            transaction = createRegularProductTransaction(request, type, user);
        } else {
            throw new RuntimeException("Either productId or (fashionProductId + variantId) must be provided");
        }

        StockTransaction savedTransaction = stockTransactionRepository.save(transaction);
        return new StockTransactionResponse(savedTransaction);
    }
    
    /**
     * Create transaction for regular product (legacy support)
     */
    private StockTransaction createRegularProductTransaction(StockTransactionRequest request, 
                                                           StockTransaction.TransactionType type, User user) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Update product quantity
        if (type == StockTransaction.TransactionType.STOCK_IN) {
            product.setQuantity(product.getQuantity() + request.getQuantity());
        } else {
            if (product.getQuantity() < request.getQuantity()) {
                throw new RuntimeException("Insufficient stock. Available: " + product.getQuantity());
            }
            product.setQuantity(product.getQuantity() - request.getQuantity());
        }

        // Save updated product
        productRepository.save(product);

        // Check for alerts after stock change
        alertService.checkAndCreateAlerts(product);

        return new StockTransaction(product, type, request.getQuantity(), request.getReason(), user);
    }
    
    /**
     * Create transaction for fashion product variant
     */
    private StockTransaction createFashionProductTransaction(StockTransactionRequest request, 
                                                           StockTransaction.TransactionType type, User user) {
        FashionProduct fashionProduct = fashionProductRepository.findById(request.getFashionProductId())
                .orElseThrow(() -> new RuntimeException("Fashion product not found"));
        
        ProductVariant variant = productVariantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new RuntimeException("Product variant not found"));
        
        // Verify variant belongs to the fashion product
        if (!variant.getProduct().getId().equals(fashionProduct.getId())) {
            throw new RuntimeException("Variant does not belong to the specified fashion product");
        }

        // Update variant quantity
        if (type == StockTransaction.TransactionType.STOCK_IN) {
            variant.setQuantity(variant.getQuantity() + request.getQuantity());
        } else {
            if (variant.getQuantity() < request.getQuantity()) {
                throw new RuntimeException("Insufficient stock. Available: " + variant.getQuantity() + 
                                         " for " + variant.getSizeDisplayName() + "/" + variant.getColorDisplayName());
            }
            variant.setQuantity(variant.getQuantity() - request.getQuantity());
        }

        // Save updated variant
        productVariantRepository.save(variant);

        // Check for alerts after stock change
        alertService.checkAndCreateVariantAlerts(variant);

        return new StockTransaction(fashionProduct, variant, type, request.getQuantity(), request.getReason(), user);
    }

    /**
     * Get all transactions
     */
    public List<StockTransactionResponse> getAllTransactions() {
        System.out.println("🔍 Fetching all transactions from database...");
        List<StockTransaction> transactions = stockTransactionRepository.findAll();
        System.out.println("📊 Database returned " + transactions.size() + " transactions");
        
        List<StockTransactionResponse> response = transactions.stream()
                .map(StockTransactionResponse::new)
                .collect(Collectors.toList());
        
        System.out.println("✅ Returning " + response.size() + " mapped responses");
        return response;
    }

    /**
     * Get transactions by type (STOCK_IN or STOCK_OUT)
     */
    public List<StockTransactionResponse> getTransactionsByType(String type) {
        try {
            System.out.println("🔍 Fetching " + type + " transactions...");
            StockTransaction.TransactionType transactionType = 
                    StockTransaction.TransactionType.valueOf(type.toUpperCase());
            
            List<StockTransaction> transactions = stockTransactionRepository
                    .findByTypeOrderByCreatedAtDesc(transactionType);
            
            System.out.println("📊 Found " + transactions.size() + " " + type + " transactions");
            
            return transactions.stream()
                    .map(StockTransactionResponse::new)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            System.err.println("❌ Invalid type: " + type);
            throw new RuntimeException("Invalid transaction type: " + type);
        }
    }

    /**
     * Get transactions by product
     */
    public List<StockTransactionResponse> getTransactionsByProduct(Long productId) {
        System.out.println("🔍 Fetching transactions for product: " + productId);
        return stockTransactionRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(StockTransactionResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get transactions by fashion product
     */
    public List<StockTransactionResponse> getTransactionsByFashionProduct(Long fashionProductId) {
        System.out.println("🔍 Fetching transactions for fashion product: " + fashionProductId);
        return stockTransactionRepository.findByFashionProductIdOrderByCreatedAtDesc(fashionProductId)
                .stream()
                .map(StockTransactionResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * Get recent transactions (top 10)
     */
    public List<StockTransactionResponse> getRecentTransactions() {
        System.out.println("🔍 Fetching recent transactions...");
        return stockTransactionRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(StockTransactionResponse::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Export all transactions to CSV format
     */
    public String exportTransactionsToCSV() {
        return exportTransactionsToCSV(null, null);
    }
    
    /**
     * Export transactions to CSV format with optional date filtering
     */
    public String exportTransactionsToCSV(String startDate, String endDate) {
        System.out.println("📊 Exporting transactions to CSV...");
        
        List<StockTransaction> transactions;
        
        if (startDate != null && endDate != null) {
            try {
                LocalDateTime start = LocalDate.parse(startDate).atStartOfDay();
                LocalDateTime end = LocalDate.parse(endDate).atTime(23, 59, 59);
                transactions = stockTransactionRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end);
                System.out.println("📅 Filtering transactions from " + startDate + " to " + endDate);
            } catch (Exception e) {
                System.err.println("❌ Error parsing dates, exporting all transactions");
                transactions = stockTransactionRepository.findAll();
            }
        } else {
            transactions = stockTransactionRepository.findAll();
        }
        
        StringBuilder csv = new StringBuilder();
        
        // CSV Headers
        csv.append("Date,Product Name,Product Details,Transaction Type,Quantity,User,Reason,Product ID,Transaction ID\n");
        
        // CSV Data
        for (StockTransaction transaction : transactions) {
            csv.append(formatCSVField(transaction.getCreatedAt().toString())).append(",");
            
            // Handle both regular products and fashion products
            String productName = transaction.getEntityName();
            if (productName == null) {
                productName = transaction.getProduct() != null ? 
                    transaction.getProduct().getName() : 
                    (transaction.getFashionProduct() != null ? transaction.getFashionProduct().getName() : "Unknown");
            }
            
            csv.append(formatCSVField(productName)).append(",");
            
            // Add variant details for fashion products
            if (transaction.getVariantDetails() != null) {
                csv.append(formatCSVField(productName + " (" + transaction.getVariantDetails() + ")")).append(",");
            } else {
                csv.append(formatCSVField(productName)).append(",");
            }
            
            csv.append(formatCSVField(transaction.getType().toString())).append(",");
            csv.append(transaction.getQuantity()).append(",");
            csv.append(formatCSVField(transaction.getUser().getUsername())).append(",");
            csv.append(formatCSVField(transaction.getReason() != null ? transaction.getReason() : "")).append(",");
            
            // Product ID (regular or fashion)
            Long productId = transaction.getProduct() != null ? 
                transaction.getProduct().getId() : 
                (transaction.getFashionProduct() != null ? transaction.getFashionProduct().getId() : 0L);
            csv.append(productId).append(",");
            
            csv.append(transaction.getId()).append("\n");
        }
        
        System.out.println("✅ CSV export completed with " + transactions.size() + " transactions");
        return csv.toString();
    }
    
    /**
     * Format CSV field to handle commas and quotes
     */
    private String formatCSVField(String field) {
        if (field == null) {
            return "";
        }
        
        // Escape quotes and wrap in quotes if contains comma or quote
        if (field.contains(",") || field.contains("\"") || field.contains("\n")) {
            return "\"" + field.replace("\"", "\"\"") + "\"";
        }
        
        return field;
    }
}
