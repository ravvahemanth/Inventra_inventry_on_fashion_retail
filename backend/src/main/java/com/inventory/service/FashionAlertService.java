package com.inventory.service;

import com.inventory.model.FashionAlert;
import com.inventory.model.FashionProduct;
import com.inventory.model.ProductVariant;
import com.inventory.repository.FashionAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FashionAlertService {

    @Autowired
    private FashionAlertRepository fashionAlertRepository;

    // Check and create alerts for fashion product variants
    public void checkAndCreateVariantAlerts(ProductVariant variant) {
        if (variant == null || variant.getProduct() == null) {
            System.err.println("⚠️ Cannot create alert for null variant or product");
            return;
        }
        
        FashionProduct fashionProduct = variant.getProduct();
        
        // Check for out of stock variant
        if (variant.isOutOfStock()) {
            String message = String.format("🚨 %s (%s/%s) is completely out of stock! Immediate restocking required.", 
                    fashionProduct.getName(),
                    variant.getSize() != null ? variant.getSize().getDisplayName() : "Unknown Size",
                    variant.getColor() != null ? variant.getColor().getDisplayName() : "Unknown Color");
            
            createOrUpdateVariantAlert(fashionProduct, variant, FashionAlert.AlertType.OUT_OF_STOCK, message);
        }
        // Check for low stock variant
        else if (variant.isLowStock()) {
            String message = String.format("⚠️ %s (%s/%s) is running low on stock. Current: %d units, Minimum required: %d units. Please restock soon.", 
                    fashionProduct.getName(),
                    variant.getSize() != null ? variant.getSize().getDisplayName() : "Unknown Size",
                    variant.getColor() != null ? variant.getColor().getDisplayName() : "Unknown Color",
                    variant.getQuantity(), 
                    variant.getMinStockLevel());
            
            createOrUpdateVariantAlert(fashionProduct, variant, FashionAlert.AlertType.LOW_STOCK, message);
        }
        // Resolve alerts if stock is back to normal
        else {
            resolveVariantAlerts(variant);
        }
    }

    // Create or update alert for fashion product variant
    private void createOrUpdateVariantAlert(FashionProduct fashionProduct, ProductVariant variant, 
                                          FashionAlert.AlertType type, String message) {
        Optional<FashionAlert> existingAlert = fashionAlertRepository.findByVariantAndTypeAndStatus(
                variant, type, FashionAlert.AlertStatus.ACTIVE);
        
        if (existingAlert.isEmpty()) {
            FashionAlert alert = new FashionAlert(fashionProduct, variant, type, message);
            fashionAlertRepository.save(alert);
            System.out.println("✅ Created fashion alert: " + message);
        }
    }

    // Resolve existing alerts for a variant
    private void resolveVariantAlerts(ProductVariant variant) {
        List<FashionAlert> activeAlerts = fashionAlertRepository.findByStatusOrderByCreatedAtDesc(FashionAlert.AlertStatus.ACTIVE)
                .stream()
                .filter(alert -> alert.getVariant() != null && alert.getVariant().getId().equals(variant.getId()))
                .toList();
        
        for (FashionAlert alert : activeAlerts) {
            alert.setStatus(FashionAlert.AlertStatus.RESOLVED);
            fashionAlertRepository.save(alert);
        }
    }

    // Get ALL fashion alerts (active + resolved)
    public List<FashionAlert> getAllAlerts() {
        return fashionAlertRepository.findAll().stream()
                .sorted((a1, a2) -> a2.getCreatedAt().compareTo(a1.getCreatedAt()))
                .toList();
    }

    // Get all active fashion alerts
    public List<FashionAlert> getAllActiveAlerts() {
        return fashionAlertRepository.findByStatusOrderByCreatedAtDesc(FashionAlert.AlertStatus.ACTIVE);
    }

    // Get recent fashion alerts
    public List<FashionAlert> getRecentAlerts() {
        return fashionAlertRepository.findTop10ByOrderByCreatedAtDesc();
    }

    // Get alerts by type
    public List<FashionAlert> getAlertsByType(FashionAlert.AlertType type) {
        return fashionAlertRepository.findAll().stream()
                .filter(alert -> alert.getType() == type)
                .sorted((a1, a2) -> a2.getCreatedAt().compareTo(a1.getCreatedAt()))
                .toList();
    }

    // Resolve a specific alert
    public void resolveAlert(Long alertId) {
        FashionAlert alert = fashionAlertRepository.findById(alertId)
                .orElseThrow(() -> new RuntimeException("Fashion alert not found with ID: " + alertId));
        
        alert.setStatus(FashionAlert.AlertStatus.RESOLVED);
        fashionAlertRepository.save(alert);
        System.out.println("✅ Fashion alert " + alertId + " resolved");
    }

    // Delete a specific alert
    public void deleteAlert(Long alertId) {
        if (!fashionAlertRepository.existsById(alertId)) {
            throw new RuntimeException("Fashion alert not found with ID: " + alertId);
        }
        fashionAlertRepository.deleteById(alertId);
        System.out.println("🗑️ Fashion alert " + alertId + " deleted");
    }

    // Mark all active alerts as resolved
    public void markAllAlertsAsResolved() {
        List<FashionAlert> activeAlerts = fashionAlertRepository.findByStatusOrderByCreatedAtDesc(FashionAlert.AlertStatus.ACTIVE);
        
        for (FashionAlert alert : activeAlerts) {
            alert.setStatus(FashionAlert.AlertStatus.RESOLVED);
            fashionAlertRepository.save(alert);
        }
        System.out.println("✅ Marked " + activeAlerts.size() + " fashion alerts as resolved");
    }
}