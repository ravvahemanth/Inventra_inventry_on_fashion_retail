package com.inventory.controller;

import com.inventory.dto.*;
import com.inventory.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class DashboardController {
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private FashionProductService fashionProductService;
    
    @Autowired
    private StockTransactionService stockTransactionService;
    
    @Autowired
    private AlertService alertService;
    
    @Autowired
    private AdminService adminService;
    
    @GetMapping("/staff")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<Map<String, Object>> getStaffDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        // Staff can view fashion products and stock levels
        List<FashionProductResponse> fashionProducts = fashionProductService.getAllFashionProducts();
        dashboard.put("products", fashionProducts);
        
        // Basic stats
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", fashionProducts.size());
        stats.put("lowStockProducts", fashionProductService.getLowStockFashionProducts().size());
        stats.put("outOfStockProducts", fashionProductService.getOutOfStockFashionProducts().size());
        dashboard.put("stats", stats);
        
        return ResponseEntity.ok(dashboard);
    }
    
    @GetMapping("/manager")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Map<String, Object>> getManagerDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        // Managers can view fashion products, manage stock, and view alerts
        List<FashionProductResponse> fashionProducts = fashionProductService.getAllFashionProducts();
        List<StockTransactionResponse> recentTransactions = stockTransactionService.getRecentTransactions();
        
        // Get only ACTIVE alerts for manager dashboard
        List<AlertResponse> activeAlerts = alertService.getAllActiveAlerts();
        
        dashboard.put("products", fashionProducts);
        dashboard.put("recentTransactions", recentTransactions);
        dashboard.put("alerts", activeAlerts);
        
        // Manager stats - calculate accurate counts for fashion products
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", fashionProducts.size());
        stats.put("lowStockProducts", fashionProductService.getLowStockFashionProducts().size());
        stats.put("outOfStockProducts", fashionProductService.getOutOfStockFashionProducts().size());
        stats.put("activeAlerts", activeAlerts.size());
        dashboard.put("stats", stats);
        
        return ResponseEntity.ok(dashboard);
    }
    
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        
        // Admin has access to everything - show fashion products
        List<FashionProductResponse> fashionProducts = fashionProductService.getAllFashionProducts();
        List<StockTransactionResponse> recentTransactions = stockTransactionService.getRecentTransactions();
        List<AlertResponse> alerts = alertService.getRecentAlerts();
        
        // Admin stats for fashion retail system
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", fashionProducts.size());
        stats.put("lowStockProducts", fashionProductService.getLowStockFashionProducts().size());
        stats.put("outOfStockProducts", fashionProductService.getOutOfStockFashionProducts().size());
        stats.put("activeAlerts", alertService.getAllActiveAlerts().size());
        stats.put("totalTransactions", recentTransactions.size());
        
        dashboard.put("products", fashionProducts);
        dashboard.put("recentTransactions", recentTransactions);
        dashboard.put("alerts", alerts);
        dashboard.put("stats", stats);
        
        return ResponseEntity.ok(dashboard);
    }
}