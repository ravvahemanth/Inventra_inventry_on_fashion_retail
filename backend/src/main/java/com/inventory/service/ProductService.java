package com.inventory.service;

import com.inventory.dto.*;
import com.inventory.model.Product;
import com.inventory.model.StockTransaction;
import com.inventory.repository.ProductRepository;
import com.inventory.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private AlertService alertService;
    
    @Autowired
    private StockTransactionService stockTransactionService;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }
    
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return new ProductResponse(product);
    }
    
    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsByName(request.getName())) {
            throw new RuntimeException("Product with this name already exists");
        }
        
        Product product = new Product(
                request.getName(),
                request.getDescription(),
                request.getCategory(),
                request.getQuantity(),
                request.getMinStockLevel(),
                request.getPrice()
        );
        
        // Set SKU if provided, otherwise it will be auto-generated
        if (request.getSku() != null && !request.getSku().trim().isEmpty()) {
            product.setSku(request.getSku());
        }
        
        Product savedProduct = productRepository.save(product);
        
        // Create transaction for product creation with initial stock
        if (savedProduct.getQuantity() > 0) {
            try {
                String username = SecurityContextHolder.getContext().getAuthentication().getName();
                StockTransactionRequest transactionRequest = new StockTransactionRequest();
                transactionRequest.setProductId(savedProduct.getId());
                transactionRequest.setType("STOCK_IN");
                transactionRequest.setQuantity(savedProduct.getQuantity());
                transactionRequest.setReason("Initial stock - Product created with " + savedProduct.getQuantity() + " units");
                
                stockTransactionService.createStockTransaction(transactionRequest, username);
                System.out.println("✅ Created transaction for new product: " + savedProduct.getName());
            } catch (Exception e) {
                System.err.println("⚠️ Failed to create transaction for new product: " + e.getMessage());
                // Don't fail product creation if transaction fails
            }
        }
        
        // Check for low stock alerts immediately after creation
        alertService.checkAndCreateAlerts(savedProduct);
        
        return new ProductResponse(savedProduct);
    }
    
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Check if name is being changed and if new name already exists
        if (!product.getName().equals(request.getName()) && 
            productRepository.existsByName(request.getName())) {
            throw new RuntimeException("Product with this name already exists");
        }
        
        // Track quantity changes for transaction
        Integer oldQuantity = product.getQuantity();
        Integer newQuantity = request.getQuantity();
        
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setQuantity(request.getQuantity());
        product.setMinStockLevel(request.getMinStockLevel());
        product.setPrice(request.getPrice());
        
        Product savedProduct = productRepository.save(product);
        
        // Create transaction for quantity changes
        if (!oldQuantity.equals(newQuantity)) {
            try {
                String username = SecurityContextHolder.getContext().getAuthentication().getName();
                StockTransactionRequest transactionRequest = new StockTransactionRequest();
                transactionRequest.setProductId(savedProduct.getId());
                
                if (newQuantity > oldQuantity) {
                    // Stock increased
                    transactionRequest.setType("STOCK_IN");
                    transactionRequest.setQuantity(newQuantity - oldQuantity);
                    transactionRequest.setReason("Product updated - Stock increased from " + oldQuantity + " to " + newQuantity);
                } else {
                    // Stock decreased
                    transactionRequest.setType("STOCK_OUT");
                    transactionRequest.setQuantity(oldQuantity - newQuantity);
                    transactionRequest.setReason("Product updated - Stock decreased from " + oldQuantity + " to " + newQuantity);
                }
                
                stockTransactionService.createStockTransaction(transactionRequest, username);
                System.out.println("✅ Created transaction for product update: " + savedProduct.getName());
            } catch (Exception e) {
                System.err.println("⚠️ Failed to create transaction for product update: " + e.getMessage());
                // Don't fail product update if transaction fails
            }
        }
        
        // Check for low stock alerts
        alertService.checkAndCreateAlerts(savedProduct);
        
        return new ProductResponse(savedProduct);
    }
    
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }
    
    public List<ProductResponse> getLowStockProducts() {
        return productRepository.findLowStockProducts().stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }
    
    public List<ProductResponse> getOutOfStockProducts() {
        return productRepository.findOutOfStockProducts().stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }
    
    public List<ProductResponse> getProductsByCategory(String category) {
        return productRepository.findByCategory(category).stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }
}