package com.inventory.service;

import com.inventory.dto.AlertResponse;
import com.inventory.model.Alert;
import com.inventory.model.Product;
import com.inventory.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    // Get ALL alerts (active + resolved) - newest first
    public List<AlertResponse> getAllAlerts() {
        return alertRepository.findAll().stream()
                .sorted((a1, a2) -> a2.getCreatedAt().compareTo(a1.getCreatedAt())) // Sort newest first
                .map(AlertResponse::new)
                .collect(Collectors.toList());
    }

    // Get all active alerts
    public List<AlertResponse> getAllActiveAlerts() {
        List<Alert> activeAlerts = alertRepository.findByStatusOrderByCreatedAtDesc(Alert.AlertStatus.ACTIVE);
        
        // ✅ FIX: Clean up orphaned alerts (alerts with deleted products)
        List<Alert> validAlerts = activeAlerts.stream()
                .filter(alert -> alert.getProduct() != null)
                .collect(Collectors.toList());
        
        // Remove orphaned alerts from database
        List<Alert> orphanedAlerts = activeAlerts.stream()
                .filter(alert -> alert.getProduct() == null)
                .collect(Collectors.toList());
        
        if (!orphanedAlerts.isEmpty()) {
            System.out.println("🧹 Cleaning up " + orphanedAlerts.size() + " orphaned alerts");
            alertRepository.deleteAll(orphanedAlerts);
        }
        
        return validAlerts.stream()
                .map(AlertResponse::new)
                .collect(Collectors.toList());
    }

    // Get recent 10 alerts
    public List<AlertResponse> getRecentAlerts() {
        return alertRepository.findTop10ByOrderByCreatedAtDesc()
                .stream()
                .map(AlertResponse::new)
                .collect(Collectors.toList());
    }

    // Get alerts by type
    public List<AlertResponse> getAlertsByType(String type) {
        try {
            Alert.AlertType alertType = Alert.AlertType.valueOf(type.toUpperCase());
            return alertRepository.findByTypeOrderByCreatedAtDesc(alertType)
                    .stream()
                    .map(AlertResponse::new)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid alert type: " + type);
        }
    }

    // Resolve a specific alert
    public AlertResponse resolveAlert(Long alertId) {
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Alert not found with ID: " + alertId));
        
        alert.setStatus(Alert.AlertStatus.RESOLVED);
        Alert savedAlert = alertRepository.save(alert);
        return new AlertResponse(savedAlert);
    }

    // Delete a specific alert
    public void deleteAlert(Long alertId) {
        if (!alertRepository.existsById(alertId)) {
            throw new RuntimeException("Alert not found with ID: " + alertId);
        }
        alertRepository.deleteById(alertId);
    }

    // Mark all active alerts as resolved
    public void markAllAlertsAsResolved() {
        List<Alert> activeAlerts = alertRepository.findByStatusOrderByCreatedAtDesc(Alert.AlertStatus.ACTIVE);
        
        for (Alert alert : activeAlerts) {
            alert.setStatus(Alert.AlertStatus.RESOLVED);
            alertRepository.save(alert);
        }
    }
    
    // ✅ NEW: Clean up orphaned alerts (alerts with deleted products)
    public int cleanupOrphanedAlerts() {
        List<Alert> allAlerts = alertRepository.findAll();
        List<Alert> orphanedAlerts = allAlerts.stream()
                .filter(alert -> alert.getProduct() == null)
                .collect(Collectors.toList());
        
        if (!orphanedAlerts.isEmpty()) {
            System.out.println("🧹 Cleaning up " + orphanedAlerts.size() + " orphaned alerts");
            alertRepository.deleteAll(orphanedAlerts);
        }
        
        return orphanedAlerts.size();
    }
    
    // ✅ NEW: Check and create alerts for fashion product variants
    public void checkAndCreateVariantAlerts(com.inventory.model.ProductVariant variant) {
        if (variant == null || variant.getProduct() == null) {
            System.err.println("⚠️ Cannot create alert for null variant or product");
            return;
        }
        
        // Check for out of stock variant
        if (variant.isOutOfStock()) {
            String message = String.format("🚨 %s (%s/%s) is completely out of stock! Immediate restocking required.", 
                    variant.getProduct().getName(),
                    variant.getSize() != null ? variant.getSize().getDisplayName() : "Unknown Size",
                    variant.getColor() != null ? variant.getColor().getDisplayName() : "Unknown Color");
            
            // Create alert using the main product (since Alert model references Product, not ProductVariant)
            createOrUpdateAlert(convertToProduct(variant.getProduct()), Alert.AlertType.OUT_OF_STOCK, message);
        }
        // Check for low stock variant
        else if (variant.isLowStock()) {
            String message = String.format("⚠️ %s (%s/%s) is running low on stock. Current: %d units, Minimum required: %d units. Please restock soon.", 
                    variant.getProduct().getName(),
                    variant.getSize() != null ? variant.getSize().getDisplayName() : "Unknown Size",
                    variant.getColor() != null ? variant.getColor().getDisplayName() : "Unknown Color",
                    variant.getQuantity(), 
                    variant.getMinStockLevel());
            
            createOrUpdateAlert(convertToProduct(variant.getProduct()), Alert.AlertType.LOW_STOCK, message);
        }
    }
    
    // Helper method to convert FashionProduct to Product for alert compatibility
    private Product convertToProduct(com.inventory.model.FashionProduct fashionProduct) {
        if (fashionProduct == null) return null;
        
        Product product = new Product();
        product.setId(fashionProduct.getId());
        product.setName(fashionProduct.getName());
        product.setSku(fashionProduct.getSku());
        product.setDescription(fashionProduct.getDescription());
        product.setCategory(fashionProduct.getCategory() != null ? fashionProduct.getCategory().getDisplayName() : "Fashion");
        product.setQuantity(fashionProduct.getTotalStock());
        product.setMinStockLevel(fashionProduct.getTotalMinStock());
        product.setPrice(fashionProduct.getBasePrice());
        product.setCreatedAt(fashionProduct.getCreatedAt());
        product.setUpdatedAt(fashionProduct.getUpdatedAt());
        
        return product;
    }

    // Check and create alerts for a product
    public void checkAndCreateAlerts(Product product) {
        if (product == null) {
            System.err.println("⚠️ Cannot create alert for null product");
            return;
        }
        
        // Check for out of stock
        if (product.getQuantity() == 0) {
            String message = String.format("🚨 %s is completely out of stock! Immediate restocking required.", 
                    product.getName());
            createOrUpdateAlert(product, Alert.AlertType.OUT_OF_STOCK, message);
        }
        // Check for low stock
        else if (product.isLowStock()) {
            String message = String.format("⚠️ %s is running low on stock. Current: %d units, Minimum required: %d units. Please restock soon.", 
                    product.getName(), product.getQuantity(), product.getMinStockLevel());
            createOrUpdateAlert(product, Alert.AlertType.LOW_STOCK, message);
        }
        // Resolve alerts if stock is back to normal
        else {
            resolveExistingAlerts(product);
        }
    }

    // Create or update alert for product
    private void createOrUpdateAlert(Product product, Alert.AlertType type, String message) {
        Optional<Alert> existingAlert = alertRepository.findByProductAndTypeAndStatus(
                product, type, Alert.AlertStatus.ACTIVE);
        
        if (existingAlert.isEmpty()) {
            Alert alert = new Alert(product, type, message);
            alertRepository.save(alert);
        }
    }

    // Resolve existing alerts for a product
    private void resolveExistingAlerts(Product product) {
        List<Alert> activeAlerts = alertRepository.findByProductAndStatusOrderByCreatedAtDesc(
                product, Alert.AlertStatus.ACTIVE);
        
        for (Alert alert : activeAlerts) {
            alert.setStatus(Alert.AlertStatus.RESOLVED);
            alertRepository.save(alert);
        }
    }
}
