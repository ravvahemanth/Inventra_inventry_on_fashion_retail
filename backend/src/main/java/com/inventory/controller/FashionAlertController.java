package com.inventory.controller;

import com.inventory.dto.ApiResponse;
import com.inventory.dto.FashionAlertResponse;
import com.inventory.model.FashionAlert;
import com.inventory.service.FashionAlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/fashion-alerts")
@CrossOrigin(origins = "http://localhost:3000")
public class FashionAlertController {

    @Autowired
    private FashionAlertService fashionAlertService;

    // Get ALL fashion alerts (active + resolved)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<List<FashionAlertResponse>>> getAllAlerts() {
        try {
            System.out.println("📊 Fetching all fashion alerts...");
            List<FashionAlert> alerts = fashionAlertService.getAllAlerts();
            List<FashionAlertResponse> response = alerts.stream()
                    .map(FashionAlertResponse::new)
                    .collect(Collectors.toList());
            System.out.println("✅ Returning " + response.size() + " fashion alerts");
            return ResponseEntity.ok(ApiResponse.success("All fashion alerts fetched successfully", response));
        } catch (Exception e) {
            System.err.println("❌ Error fetching fashion alerts: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch fashion alerts: " + e.getMessage()));
        }
    }

    // Get only active fashion alerts
    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<List<FashionAlertResponse>>> getActiveAlerts() {
        try {
            System.out.println("📊 Fetching active fashion alerts...");
            List<FashionAlert> alerts = fashionAlertService.getAllActiveAlerts();
            List<FashionAlertResponse> response = alerts.stream()
                    .map(FashionAlertResponse::new)
                    .collect(Collectors.toList());
            System.out.println("✅ Returning " + response.size() + " active fashion alerts");
            return ResponseEntity.ok(ApiResponse.success("Active fashion alerts fetched successfully", response));
        } catch (Exception e) {
            System.err.println("❌ Error fetching active fashion alerts: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch active fashion alerts: " + e.getMessage()));
        }
    }

    // Get recent fashion alerts (top 10)
    @GetMapping("/recent")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<List<FashionAlertResponse>>> getRecentAlerts() {
        try {
            System.out.println("📊 Fetching recent fashion alerts...");
            List<FashionAlert> alerts = fashionAlertService.getRecentAlerts();
            List<FashionAlertResponse> response = alerts.stream()
                    .map(FashionAlertResponse::new)
                    .collect(Collectors.toList());
            System.out.println("✅ Returning " + response.size() + " recent fashion alerts");
            return ResponseEntity.ok(ApiResponse.success("Recent fashion alerts fetched successfully", response));
        } catch (Exception e) {
            System.err.println("❌ Error fetching recent fashion alerts: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch recent fashion alerts: " + e.getMessage()));
        }
    }

    // Get fashion alerts by type (LOW_STOCK or OUT_OF_STOCK)
    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<List<FashionAlertResponse>>> getAlertsByType(@PathVariable String type) {
        try {
            System.out.println("📊 Fetching fashion alerts of type: " + type);
            FashionAlert.AlertType alertType = FashionAlert.AlertType.valueOf(type.toUpperCase());
            List<FashionAlert> alerts = fashionAlertService.getAlertsByType(alertType);
            List<FashionAlertResponse> response = alerts.stream()
                    .map(FashionAlertResponse::new)
                    .collect(Collectors.toList());
            System.out.println("✅ Returning " + response.size() + " " + type + " fashion alerts");
            return ResponseEntity.ok(ApiResponse.success("Fashion alerts of type " + type + " fetched successfully", response));
        } catch (IllegalArgumentException e) {
            System.err.println("❌ Invalid alert type: " + type);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid alert type: " + type + ". Must be LOW_STOCK or OUT_OF_STOCK"));
        } catch (Exception e) {
            System.err.println("❌ Error fetching fashion alerts: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch fashion alerts: " + e.getMessage()));
        }
    }

    // Resolve fashion alert (mark as resolved)
    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<FashionAlertResponse>> resolveAlert(@PathVariable Long id) {
        try {
            System.out.println("✅ Resolving fashion alert ID: " + id);
            fashionAlertService.resolveAlert(id);
            return ResponseEntity.ok(ApiResponse.success("Fashion alert resolved successfully"));
        } catch (Exception e) {
            System.err.println("❌ Error resolving fashion alert: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to resolve fashion alert: " + e.getMessage()));
        }
    }

    // Delete fashion alert
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteAlert(@PathVariable Long id) {
        try {
            System.out.println("🗑️ Deleting fashion alert ID: " + id);
            fashionAlertService.deleteAlert(id);
            return ResponseEntity.ok(ApiResponse.success("Fashion alert deleted successfully"));
        } catch (Exception e) {
            System.err.println("❌ Error deleting fashion alert: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete fashion alert: " + e.getMessage()));
        }
    }

    // Mark all fashion alerts as resolved
    @PutMapping("/mark-all-resolved")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<String>> markAllAsResolved() {
        try {
            System.out.println("✅ Marking all fashion alerts as resolved...");
            fashionAlertService.markAllAlertsAsResolved();
            return ResponseEntity.ok(ApiResponse.success("All fashion alerts marked as resolved successfully"));
        } catch (Exception e) {
            System.err.println("❌ Error marking all fashion alerts: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to mark all fashion alerts: " + e.getMessage()));
        }
    }
    
    // Get fashion alert count (for dashboard)
    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<Long>> getAlertCount() {
        try {
            long count = fashionAlertService.getAllActiveAlerts().size();
            System.out.println("📊 Active fashion alert count: " + count);
            return ResponseEntity.ok(ApiResponse.success("Fashion alert count fetched successfully", count));
        } catch (Exception e) {
            System.err.println("❌ Error getting fashion alert count: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get fashion alert count: " + e.getMessage()));
        }
    }
}
