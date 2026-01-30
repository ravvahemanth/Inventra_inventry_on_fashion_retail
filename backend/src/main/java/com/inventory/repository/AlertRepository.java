package com.inventory.repository;

import com.inventory.model.Alert;
import com.inventory.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    
    List<Alert> findByStatusOrderByCreatedAtDesc(Alert.AlertStatus status);
    
    List<Alert> findByTypeOrderByCreatedAtDesc(Alert.AlertType type);
    
    List<Alert> findByProductAndStatusOrderByCreatedAtDesc(Product product, Alert.AlertStatus status);
    
    Optional<Alert> findByProductAndTypeAndStatus(Product product, Alert.AlertType type, Alert.AlertStatus status);
    
    List<Alert> findTop10ByOrderByCreatedAtDesc();
}
