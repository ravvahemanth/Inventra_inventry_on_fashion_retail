package com.inventory.repository;

import com.inventory.model.FashionAlert;
import com.inventory.model.FashionProduct;
import com.inventory.model.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FashionAlertRepository extends JpaRepository<FashionAlert, Long> {
    
    List<FashionAlert> findByStatusOrderByCreatedAtDesc(FashionAlert.AlertStatus status);
    
    List<FashionAlert> findByTypeOrderByCreatedAtDesc(FashionAlert.AlertType type);
    
    List<FashionAlert> findByFashionProductAndStatusOrderByCreatedAtDesc(FashionProduct fashionProduct, FashionAlert.AlertStatus status);
    
    Optional<FashionAlert> findByFashionProductAndTypeAndStatus(FashionProduct fashionProduct, FashionAlert.AlertType type, FashionAlert.AlertStatus status);
    
    Optional<FashionAlert> findByVariantAndTypeAndStatus(ProductVariant variant, FashionAlert.AlertType type, FashionAlert.AlertStatus status);
    
    List<FashionAlert> findTop10ByOrderByCreatedAtDesc();
    
    long countByStatus(FashionAlert.AlertStatus status);
}