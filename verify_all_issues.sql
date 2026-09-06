-- Complete Database Verification Script
-- Run this to check all issues mentioned

USE fashion_retail_db;

-- ============================================
-- 1. DASHBOARD STATS VERIFICATION
-- ============================================

SELECT '=== DASHBOARD STATS ===' AS section;

-- Total Products
SELECT 
    'Total Products' AS metric,
    COUNT(*) AS count
FROM fashion_products;

-- Low Stock Products (any variant low but not 0)
SELECT 
    'Low Stock Products' AS metric,
    COUNT(DISTINCT fp.id) AS count
FROM fashion_products fp
JOIN product_variants pv ON pv.fashion_product_id = fp.id
WHERE pv.quantity > 0 
  AND pv.quantity <= pv.min_stock_level;

-- Out of Stock Products (all variants = 0)
SELECT 
    'Out of Stock Products' AS metric,
    COUNT(DISTINCT fp.id) AS count
FROM fashion_products fp
WHERE NOT EXISTS (
    SELECT 1 FROM product_variants pv 
    WHERE pv.fashion_product_id = fp.id 
      AND pv.quantity > 0
);

-- Active Alerts
SELECT 
    'Active Alerts' AS metric,
    COUNT(*) AS count
FROM fashion_alerts 
WHERE status = 'ACTIVE';

-- ============================================
-- 2. ALERT SYSTEM VERIFICATION
-- ============================================

SELECT '=== ALERT SYSTEM ===' AS section;

-- Alert counts by status and type
SELECT 
    status,
    type,
    COUNT(*) as count
FROM fashion_alerts
GROUP BY status, type
ORDER BY status, type;

-- Active alerts with product details
SELECT 
    fa.id AS alert_id,
    fp.name AS product_name,
    pv.size,
    pv.color,
    pv.quantity AS current_stock,
    pv.min_stock_level,
    fa.type AS alert_type,
    fa.status,
    fa.message,
    fa.created_at
FROM fashion_alerts fa
JOIN fashion_products fp ON fa.fashion_product_id = fp.id
LEFT JOIN product_variants pv ON fa.variant_id = pv.id
WHERE fa.status = 'ACTIVE'
ORDER BY fa.created_at DESC
LIMIT 20;

-- Alerts that should be resolved (stock is now OK)
SELECT 
    fa.id AS alert_id,
    fp.name AS product_name,
    pv.size,
    pv.color,
    pv.quantity AS current_stock,
    pv.min_stock_level,
    fa.type AS alert_type,
    fa.status,
    CASE 
        WHEN pv.quantity > pv.min_stock_level THEN 'Should be RESOLVED'
        ELSE 'Correctly ACTIVE'
    END AS alert_status_check
FROM fashion_alerts fa
JOIN fashion_products fp ON fa.fashion_product_id = fp.id
LEFT JOIN product_variants pv ON fa.variant_id = pv.id
WHERE fa.status = 'ACTIVE'
  AND pv.quantity > pv.min_stock_level;

-- ============================================
-- 3. STOCK OPERATIONS VERIFICATION
-- ============================================

SELECT '=== STOCK OPERATIONS ===' AS section;

-- Recent stock transactions
SELECT 
    st.id AS transaction_id,
    fp.name AS product_name,
    pv.size,
    pv.color,
    st.type AS transaction_type,
    st.quantity,
    st.reason,
    u.username,
    st.created_at
FROM stock_transactions st
LEFT JOIN fashion_products fp ON st.fashion_product_id = fp.id
LEFT JOIN product_variants pv ON st.variant_id = pv.id
LEFT JOIN users u ON st.user_id = u.id
ORDER BY st.created_at DESC
LIMIT 20;

-- Transaction counts by type
SELECT 
    type,
    COUNT(*) as count,
    SUM(quantity) as total_quantity
FROM stock_transactions
GROUP BY type;

-- ============================================
-- 4. PRODUCT STOCK STATUS DETAILS
-- ============================================

SELECT '=== PRODUCT STOCK STATUS ===' AS section;

-- Detailed product stock status
SELECT 
    fp.id,
    fp.name,
    fp.brand,
    fp.category,
    COUNT(pv.id) AS total_variants,
    SUM(pv.quantity) AS total_stock,
    SUM(pv.min_stock_level) AS total_min_stock,
    MIN(pv.quantity) AS min_variant_stock,
    MAX(pv.quantity) AS max_variant_stock,
    CASE 
        WHEN SUM(pv.quantity) = 0 THEN 'OUT_OF_STOCK'
        WHEN EXISTS (
            SELECT 1 FROM product_variants v 
            WHERE v.fashion_product_id = fp.id 
              AND v.quantity > 0 
              AND v.quantity <= v.min_stock_level
        ) THEN 'LOW_STOCK'
        ELSE 'IN_STOCK'
    END AS status,
    -- Check if alert exists
    (SELECT COUNT(*) FROM fashion_alerts fa 
     WHERE fa.fashion_product_id = fp.id 
       AND fa.status = 'ACTIVE') AS active_alerts
FROM fashion_products fp
LEFT JOIN product_variants pv ON pv.fashion_product_id = fp.id
GROUP BY fp.id, fp.name, fp.brand, fp.category
ORDER BY 
    CASE 
        WHEN SUM(pv.quantity) = 0 THEN 1
        WHEN EXISTS (
            SELECT 1 FROM product_variants v 
            WHERE v.fashion_product_id = fp.id 
              AND v.quantity > 0 
              AND v.quantity <= v.min_stock_level
        ) THEN 2
        ELSE 3
    END,
    fp.name;

-- ============================================
-- 5. VARIANT-LEVEL STOCK STATUS
-- ============================================

SELECT '=== VARIANT STOCK STATUS ===' AS section;

-- All variants with stock status
SELECT 
    fp.name AS product_name,
    pv.size,
    pv.color,
    pv.quantity AS current_stock,
    pv.min_stock_level,
    CASE 
        WHEN pv.quantity = 0 THEN 'OUT_OF_STOCK'
        WHEN pv.quantity <= pv.min_stock_level THEN 'LOW_STOCK'
        ELSE 'IN_STOCK'
    END AS status,
    -- Check if alert exists for this variant
    (SELECT COUNT(*) FROM fashion_alerts fa 
     WHERE fa.variant_id = pv.id 
       AND fa.status = 'ACTIVE') AS has_alert
FROM product_variants pv
JOIN fashion_products fp ON pv.fashion_product_id = fp.id
ORDER BY 
    CASE 
        WHEN pv.quantity = 0 THEN 1
        WHEN pv.quantity <= pv.min_stock_level THEN 2
        ELSE 3
    END,
    fp.name,
    pv.size,
    pv.color;

-- ============================================
-- 6. ORPHANED RECORDS CHECK
-- ============================================

SELECT '=== ORPHANED RECORDS CHECK ===' AS section;

-- Alerts without valid products
SELECT 
    'Alerts without products' AS issue,
    COUNT(*) AS count
FROM fashion_alerts fa
LEFT JOIN fashion_products fp ON fa.fashion_product_id = fp.id
WHERE fp.id IS NULL;

-- Alerts without valid variants (where variant_id is not null)
SELECT 
    'Alerts without variants' AS issue,
    COUNT(*) AS count
FROM fashion_alerts fa
LEFT JOIN product_variants pv ON fa.variant_id = pv.id
WHERE fa.variant_id IS NOT NULL 
  AND pv.id IS NULL;

-- Transactions without valid products
SELECT 
    'Transactions without products' AS issue,
    COUNT(*) AS count
FROM stock_transactions st
LEFT JOIN fashion_products fp ON st.fashion_product_id = fp.id
WHERE st.fashion_product_id IS NOT NULL 
  AND fp.id IS NULL;

-- Variants without products
SELECT 
    'Variants without products' AS issue,
    COUNT(*) AS count
FROM product_variants pv
LEFT JOIN fashion_products fp ON pv.fashion_product_id = fp.id
WHERE fp.id IS NULL;

-- ============================================
-- 7. DATA INTEGRITY CHECKS
-- ============================================

SELECT '=== DATA INTEGRITY ===' AS section;

-- Products with no variants
SELECT 
    'Products with no variants' AS issue,
    COUNT(*) AS count
FROM fashion_products fp
LEFT JOIN product_variants pv ON pv.fashion_product_id = fp.id
WHERE pv.id IS NULL;

-- Variants with negative stock
SELECT 
    'Variants with negative stock' AS issue,
    COUNT(*) AS count
FROM product_variants
WHERE quantity < 0;

-- Variants with quantity > min but have active LOW_STOCK alert
SELECT 
    'Incorrect LOW_STOCK alerts' AS issue,
    COUNT(*) AS count
FROM fashion_alerts fa
JOIN product_variants pv ON fa.variant_id = pv.id
WHERE fa.type = 'LOW_STOCK'
  AND fa.status = 'ACTIVE'
  AND pv.quantity > pv.min_stock_level;

-- Variants with quantity > 0 but have active OUT_OF_STOCK alert
SELECT 
    'Incorrect OUT_OF_STOCK alerts' AS issue,
    COUNT(*) AS count
FROM fashion_alerts fa
JOIN product_variants pv ON fa.variant_id = pv.id
WHERE fa.type = 'OUT_OF_STOCK'
  AND fa.status = 'ACTIVE'
  AND pv.quantity > 0;

-- ============================================
-- 8. SUMMARY REPORT
-- ============================================

SELECT '=== SUMMARY REPORT ===' AS section;

SELECT 
    'Total Fashion Products' AS metric,
    COUNT(*) AS value
FROM fashion_products
UNION ALL
SELECT 
    'Total Variants',
    COUNT(*)
FROM product_variants
UNION ALL
SELECT 
    'Total Stock Units',
    SUM(quantity)
FROM product_variants
UNION ALL
SELECT 
    'Products In Stock',
    COUNT(DISTINCT fp.id)
FROM fashion_products fp
WHERE EXISTS (
    SELECT 1 FROM product_variants pv 
    WHERE pv.fashion_product_id = fp.id 
      AND pv.quantity > pv.min_stock_level
)
UNION ALL
SELECT 
    'Products Low Stock',
    COUNT(DISTINCT fp.id)
FROM fashion_products fp
JOIN product_variants pv ON pv.fashion_product_id = fp.id
WHERE pv.quantity > 0 
  AND pv.quantity <= pv.min_stock_level
UNION ALL
SELECT 
    'Products Out of Stock',
    COUNT(DISTINCT fp.id)
FROM fashion_products fp
WHERE NOT EXISTS (
    SELECT 1 FROM product_variants pv 
    WHERE pv.fashion_product_id = fp.id 
      AND pv.quantity > 0
)
UNION ALL
SELECT 
    'Active Alerts',
    COUNT(*)
FROM fashion_alerts
WHERE status = 'ACTIVE'
UNION ALL
SELECT 
    'Resolved Alerts',
    COUNT(*)
FROM fashion_alerts
WHERE status = 'RESOLVED'
UNION ALL
SELECT 
    'Total Transactions',
    COUNT(*)
FROM stock_transactions
UNION ALL
SELECT 
    'Stock In Transactions',
    COUNT(*)
FROM stock_transactions
WHERE type = 'STOCK_IN'
UNION ALL
SELECT 
    'Stock Out Transactions',
    COUNT(*)
FROM stock_transactions
WHERE type = 'STOCK_OUT';
