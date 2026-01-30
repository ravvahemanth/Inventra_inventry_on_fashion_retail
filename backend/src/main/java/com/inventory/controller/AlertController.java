package com.inventory.controller;

import com.inventory.dto.AlertResponse;
import com.inventory.dto.ApiResponse;
import com.inventory.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "http://localhost:3000")
public class AlertController {

    @Autowired
    private AlertService alertService;

    // Get ALL alerts (active + resolved)
    @GetMapping
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getAllAlerts() {
        try {
            List<AlertResponse> alerts = alertService.getAllAlerts();
            return ResponseEntity.ok(ApiResponse.success("All alerts fetched successfully", alerts));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch alerts: " + e.getMessage()));
        }
    }

    // Get only active alerts
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getActiveAlerts() {
        try {
            List<AlertResponse> alerts = alertService.getAllActiveAlerts();
            return ResponseEntity.ok(ApiResponse.success("Active alerts fetched successfully", alerts));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch active alerts: " + e.getMessage()));
        }
    }

    // Get recent alerts (top 10)
    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getRecentAlerts() {
        try {
            List<AlertResponse> alerts = alertService.getRecentAlerts();
            return ResponseEntity.ok(ApiResponse.success("Recent alerts fetched successfully", alerts));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch recent alerts: " + e.getMessage()));
        }
    }

    // Get alerts by type (LOW_STOCK or OUT_OF_STOCK)
    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<AlertResponse>>> getAlertsByType(@PathVariable String type) {
        try {
            List<AlertResponse> alerts = alertService.getAlertsByType(type);
            return ResponseEntity.ok(ApiResponse.success("Alerts of type " + type + " fetched successfully", alerts));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to fetch alerts: " + e.getMessage()));
        }
    }

    // Resolve alert (mark as resolved)
    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<AlertResponse>> resolveAlert(@PathVariable Long id) {
        try {
            AlertResponse alert = alertService.resolveAlert(id);
            return ResponseEntity.ok(ApiResponse.success("Alert resolved successfully", alert));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to resolve alert: " + e.getMessage()));
        }
    }

    // Delete alert
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteAlert(@PathVariable Long id) {
        try {
            alertService.deleteAlert(id);
            return ResponseEntity.ok(ApiResponse.success("Alert deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete alert: " + e.getMessage()));
        }
    }

    // Mark all alerts as resolved
    @PutMapping("/mark-all-resolved")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<String>> markAllAsResolved() {
        try {
            alertService.markAllAlertsAsResolved();
            return ResponseEntity.ok(ApiResponse.success("All alerts marked as resolved successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to mark all alerts: " + e.getMessage()));
        }
    }
    
    // ✅ NEW: Clean up orphaned alerts
    @DeleteMapping("/cleanup-orphaned")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> cleanupOrphanedAlerts() {
        try {
            int cleanedCount = alertService.cleanupOrphanedAlerts();
            return ResponseEntity.ok(ApiResponse.success("Cleaned up " + cleanedCount + " orphaned alerts successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to cleanup orphaned alerts: " + e.getMessage()));
        }
    }
}
