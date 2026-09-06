-- ============================================
-- Stock Status Verification Script
-- ============================================
-- This script helps verify that stock status
-- is correctly calculated in the database
-- ============================================

-- 1. CHECK ALL PRODUCTS WITH THEIR STOCK STATUS
-- ============================================
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.brand,
    COUNT(v.id) as total_variants,
    SUM(v.quantity) as total_stock,
    SUM(v.min_stock_level) as total_min_stock,
    -- Count variants by status
    SUM(CASE WHEN v.quantity = 0 THEN 1 ELSE 0 END) as out_of_stock_variants,
    SUM(CASE WHEN v.quantity > 0 AND v.quantity <= v.min_stock_level THEN 1 ELSE 0 END) as low_stock_variants,
    SUM(CASE WHEN v.quantity > v.min_stock_level THEN 1 ELSE 0 END) as normal_stock_variants,
    -- Overall product status
    CASE 
        WHEN SUM(v.quantity) = 0 THEN '❌ OUT OF STOCK'
        WHEN SUM(CASE WHEN v.quantity > 0 AND v.quantity <= v.min_stock_level THEN 1 ELSE 0 END) > 0 
            THEN '⚠️ LOW STOCK'
        ELSE '✅ IN STOCK'
    END as product_status
FROM fashion_products p
LEFT JOIN product_variants v ON v.product_id = p.id
GROUP BY p.id, p.name, p.brand
ORDER BY 
    CASE 
        WHEN SUM(v.quantity) = 0 THEN 1
        WHEN SUM(CASE WHEN v.quantity > 0 AND v.quantity <= v.min_stock_level THEN 1 ELSE 0 END) > 0 THEN 2
        ELSE 3
    END,
    p.name;

-- 2. DETAILED VIEW OF LOW STOCK VARIANTS
-- ============================================
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.brand,
    v.id as variant_id,
    v.size,
    v.color,
    v.quantity as current_stock,
    v.min_stock_level as minimum_required,
    (v.min_stock_level - v.quantity) as shortage,
    CASE 
        WHEN v.quantity = 0 THEN '❌ OUT'
        WHEN v.quantity <= v.min_stock_level THEN '⚠️ LOW'
        ELSE '✅ OK'
    END as variant_status
FROM fashion_products p
JOIN product_variants v ON v.product_id = p.id
WHERE v.quantity > 0 AND v.quantity <= v.min_stock_level
ORDER BY p.name, v.size, v.color;

-- 3. PRODUCTS COMPLETELY OUT OF STOCK
-- ============================================
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.brand,
    p.category,
    COUNT(v.id) as total_variants,
    SUM(v.quantity) as total_stock,
    '❌ ALL VARIANTS OUT OF STOCK' as status
FROM fashion_products p
LEFT JOIN product_variants v ON v.product_id = p.id
GROUP BY p.id, p.name, p.brand, p.category
HAVING SUM(v.quantity) = 0 OR SUM(v.quantity) IS NULL
ORDER BY p.name;

-- 4. SUMMARY COUNTS (DASHBOARD STATS)
-- ============================================
SELECT 
    'Total Products' as metric,
    COUNT(DISTINCT p.id) as count
FROM fashion_products p

UNION ALL

SELECT 
    'Low Stock Products' as metric,
    COUNT(DISTINCT p.id) as count
FROM fashion_products p
JOIN product_variants v ON v.product_id = p.id
WHERE v.quantity > 0 AND v.quantity <= v.min_stock_level

UNION ALL

SELECT 
    'Out of Stock Products' as metric,
    COUNT(DISTINCT p.id) as count
FROM fashion_products p
LEFT JOIN product_variants v ON v.product_id = p.id
GROUP BY p.id
HAVING SUM(v.quantity) = 0 OR SUM(v.quantity) IS NULL

UNION ALL

SELECT 
    'In Stock Products' as metric,
    COUNT(DISTINCT p.id) as count
FROM fashion_products p
WHERE p.id NOT IN (
    -- Exclude low stock products
    SELECT DISTINCT p2.id
    FROM fashion_products p2
    JOIN product_variants v2 ON v2.product_id = p2.id
    WHERE v2.quantity > 0 AND v2.quantity <= v2.min_stock_level
)
AND p.id NOT IN (
    -- Exclude out of stock products
    SELECT p3.id
    FROM fashion_products p3
    LEFT JOIN product_variants v3 ON v3.product_id = p3.id
    GROUP BY p3.id
    HAVING SUM(v3.quantity) = 0 OR SUM(v3.quantity) IS NULL
);

-- 5. VARIANT-LEVEL STOCK DETAILS
-- ============================================
SELECT 
    p.name as product_name,
    v.size,
    v.color,
    v.quantity,
    v.min_stock_level,
    CASE 
        WHEN v.quantity = 0 THEN '❌ OUT OF STOCK'
        WHEN v.quantity <= v.min_stock_level THEN '⚠️ LOW STOCK'
        WHEN v.quantity <= v.min_stock_level * 1.5 THEN '⚡ GETTING LOW'
        ELSE '✅ GOOD STOCK'
    END as status,
    CONCAT(
        ROUND((v.quantity * 100.0 / NULLIF(v.min_stock_level, 0)), 1), 
        '%'
    ) as stock_percentage
FROM fashion_products p
JOIN product_variants v ON v.product_id = p.id
ORDER BY 
    CASE 
        WHEN v.quantity = 0 THEN 1
        WHEN v.quantity <= v.min_stock_level THEN 2
        WHEN v.quantity <= v.min_stock_level * 1.5 THEN 3
        ELSE 4
    END,
    p.name,
    v.size,
    v.color;

-- 6. PRODUCTS NEEDING IMMEDIATE ATTENTION
-- ============================================
SELECT 
    p.id,
    p.name,
    p.brand,
    COUNT(v.id) as total_variants,
    SUM(CASE WHEN v.quantity = 0 THEN 1 ELSE 0 END) as out_variants,
    SUM(CASE WHEN v.quantity > 0 AND v.quantity <= v.min_stock_level THEN 1 ELSE 0 END) as low_variants,
    SUM(v.quantity) as total_stock,
    SUM(v.min_stock_level) as total_min_stock,
    CASE 
        WHEN SUM(v.quantity) = 0 THEN '🚨 CRITICAL - ALL OUT'
        WHEN SUM(CASE WHEN v.quantity = 0 THEN 1 ELSE 0 END) > COUNT(v.id) / 2 
            THEN '🔴 URGENT - MOSTLY OUT'
        WHEN SUM(CASE WHEN v.quantity > 0 AND v.quantity <= v.min_stock_level THEN 1 ELSE 0 END) > 0 
            THEN '🟡 WARNING - LOW STOCK'
        ELSE '🟢 OK'
    END as priority
FROM fashion_products p
LEFT JOIN product_variants v ON v.product_id = p.id
GROUP BY p.id, p.name, p.brand
HAVING 
    SUM(v.quantity) = 0 
    OR SUM(CASE WHEN v.quantity > 0 AND v.quantity <= v.min_stock_level THEN 1 ELSE 0 END) > 0
ORDER BY 
    CASE 
        WHEN SUM(v.quantity) = 0 THEN 1
        WHEN SUM(CASE WHEN v.quantity = 0 THEN 1 ELSE 0 END) > COUNT(v.id) / 2 THEN 2
        WHEN SUM(CASE WHEN v.quantity > 0 AND v.quantity <= v.min_stock_level THEN 1 ELSE 0 END) > 0 THEN 3
        ELSE 4
    END,
    p.name;

-- 7. VERIFY ALERTS MATCH STOCK STATUS
-- ============================================
SELECT 
    fa.id as alert_id,
    fa.type as alert_type,
    fa.status as alert_status,
    fa.message,
    p.name as product_name,
    v.size,
    v.color,
    v.quantity as current_stock,
    v.min_stock_level,
    CASE 
        WHEN v.quantity = 0 AND fa.type = 'OUT_OF_STOCK' THEN '✅ CORRECT'
        WHEN v.quantity > 0 AND v.quantity <= v.min_stock_level AND fa.type = 'LOW_STOCK' THEN '✅ CORRECT'
        WHEN v.quantity > v.min_stock_level AND fa.status = 'ACTIVE' THEN '❌ SHOULD BE RESOLVED'
        ELSE '⚠️ CHECK'
    END as alert_accuracy
FROM fashion_alerts fa
JOIN fashion_products p ON fa.fashion_product_id = p.id
LEFT JOIN product_variants v ON fa.variant_id = v.id
WHERE fa.status = 'ACTIVE'
ORDER BY 
    CASE 
        WHEN v.quantity > v.min_stock_level AND fa.status = 'ACTIVE' THEN 1
        ELSE 2
    END,
    fa.created_at DESC;

-- 8. TEST DATA SCENARIOS
-- ============================================
-- Uncomment to create test scenarios

-- Create a low stock scenario
-- UPDATE product_variants SET quantity = 5 WHERE id = 1 AND min_stock_level = 10;

-- Create an out of stock scenario
-- UPDATE product_variants SET quantity = 0 WHERE product_id = 5;

-- Restore normal stock
-- UPDATE product_variants SET quantity = 50 WHERE id = 1;

-- ============================================
-- END OF VERIFICATION SCRIPT
-- ============================================
