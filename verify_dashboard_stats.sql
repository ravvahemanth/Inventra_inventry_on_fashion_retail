-- Verify Dashboard Statistics for Manager Role
-- Run this in MySQL to check actual counts

USE fashion_retail_db;

-- 1. Total Fashion Products
SELECT 
    'Total Fashion Products' AS Metric,
    COUNT(*) AS Count
FROM fashion_products;

-- 2. Low Stock Products (products with at least one variant low on stock but not 0)
SELECT 
    'Low Stock Products' AS Metric,
    COUNT(DISTINCT fp.id) AS Count
FROM fashion_products fp
JOIN product_variants pv ON pv.fashion_product_id = fp.id
WHERE pv.quantity > 0 
  AND pv.quantity <= pv.min_stock_level;

-- 3. Out of Stock Products (products where ALL variants have 0 quantity)
SELECT 
    'Out of Stock Products' AS Metric,
    COUNT(DISTINCT fp.id) AS Count
FROM fashion_products fp
WHERE NOT EXISTS (
    SELECT 1 
    FROM product_variants pv 
    WHERE pv.fashion_product_id = fp.id 
      AND pv.quantity > 0
);

-- 4. Active Alerts Count
SELECT 
    'Active Alerts' AS Metric,
    COUNT(*) AS Count
FROM fashion_alerts
WHERE status = 'ACTIVE';

-- 5. Detailed Low Stock Products List
SELECT 
    fp.id,
    fp.name,
    fp.brand,
    pv.size,
    pv.color,
    pv.quantity,
    pv.min_stock_level,
    CASE 
        WHEN pv.quantity = 0 THEN 'OUT_OF_STOCK'
        WHEN pv.quantity <= pv.min_stock_level THEN 'LOW_STOCK'
        ELSE 'IN_STOCK'
    END AS status
FROM fashion_products fp
JOIN product_variants pv ON pv.fashion_product_id = fp.id
WHERE pv.quantity > 0 
  AND pv.quantity <= pv.min_stock_level
ORDER BY fp.name, pv.size, pv.color;

-- 6. Detailed Out of Stock Products List
SELECT 
    fp.id,
    fp.name,
    fp.brand,
    COUNT(pv.id) AS total_variants,
    SUM(CASE WHEN pv.quantity = 0 THEN 1 ELSE 0 END) AS zero_stock_variants
FROM fashion_products fp
LEFT JOIN product_variants pv ON pv.fashion_product_id = fp.id
GROUP BY fp.id, fp.name, fp.brand
HAVING COUNT(pv.id) = SUM(CASE WHEN pv.quantity = 0 THEN 1 ELSE 0 END)
ORDER BY fp.name;

-- 7. All Products with Stock Summary
SELECT 
    fp.id,
    fp.name,
    fp.brand,
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
    END AS product_status
FROM fashion_products fp
LEFT JOIN product_variants pv ON pv.fashion_product_id = fp.id
GROUP BY fp.id, fp.name, fp.brand
ORDER BY product_status DESC, fp.name;
