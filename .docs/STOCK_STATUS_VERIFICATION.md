# Stock Status Verification Guide

## Stock Status Rules

### 1. Low Stock Detection
**Rule**: A product shows "Low Stock" if ANY variant has:
- `quantity > 0` (not completely out)
- `quantity ≤ minStockLevel`

**Example**:
```
Product: Nike Shoes
- Variant 1 (M/Black): quantity=15, minStockLevel=10 → OK
- Variant 2 (L/Red): quantity=8, minStockLevel=10 → LOW STOCK ⚠️
- Variant 3 (XL/Blue): quantity=0, minStockLevel=10 → OUT (excluded from low stock)

Result: Product shows as "Low Stock" because Variant 2 is low
```

### 2. Out of Stock Detection
**Rule**: A product shows "Out of Stock" if ALL variants have:
- `quantity = 0`

**Example**:
```
Product: Adidas Sneakers
- Variant 1 (S/White): quantity=0, minStockLevel=5
- Variant 2 (M/Black): quantity=0, minStockLevel=5
- Variant 3 (L/Gray): quantity=0, minStockLevel=5

Result: Product shows as "Out of Stock" ❌
```

### 3. In Stock (Normal)
**Rule**: A product shows "In Stock" if:
- At least one variant has `quantity > minStockLevel`
- No variants are at or below minimum (excluding zero stock variants)

**Example**:
```
Product: Puma T-Shirt
- Variant 1 (S/Red): quantity=50, minStockLevel=10 → OK ✓
- Variant 2 (M/Blue): quantity=30, minStockLevel=10 → OK ✓
- Variant 3 (L/Green): quantity=20, minStockLevel=10 → OK ✓

Result: Product shows as "In Stock" ✓
```

## Database Queries

### Check Low Stock Products
```sql
-- Find products with low stock variants
SELECT DISTINCT 
    p.id,
    p.name,
    p.brand,
    v.size,
    v.color,
    v.quantity,
    v.min_stock_level,
    CASE 
        WHEN v.quantity = 0 THEN 'OUT OF STOCK'
        WHEN v.quantity <= v.min_stock_level THEN 'LOW STOCK'
        ELSE 'IN STOCK'
    END as status
FROM fashion_products p
JOIN product_variants v ON v.product_id = p.id
WHERE v.quantity > 0 AND v.quantity <= v.min_stock_level
ORDER BY p.name, v.size, v.color;
```

### Check Out of Stock Products
```sql
-- Find products that are completely out of stock
SELECT 
    p.id,
    p.name,
    p.brand,
    COUNT(v.id) as total_variants,
    SUM(v.quantity) as total_stock
FROM fashion_products p
LEFT JOIN product_variants v ON v.product_id = p.id
GROUP BY p.id, p.name, p.brand
HAVING SUM(v.quantity) = 0 OR SUM(v.quantity) IS NULL
ORDER BY p.name;
```

### Check All Products with Stock Status
```sql
-- Complete stock status overview
SELECT 
    p.id,
    p.name,
    p.brand,
    COUNT(v.id) as total_variants,
    SUM(v.quantity) as total_stock,
    SUM(v.min_stock_level) as total_min_stock,
    CASE 
        WHEN SUM(v.quantity) = 0 THEN 'OUT OF STOCK'
        WHEN EXISTS (
            SELECT 1 FROM product_variants v2 
            WHERE v2.product_id = p.id 
            AND v2.quantity > 0 
            AND v2.quantity <= v2.min_stock_level
        ) THEN 'LOW STOCK'
        ELSE 'IN STOCK'
    END as product_status
FROM fashion_products p
LEFT JOIN product_variants v ON v.product_id = p.id
GROUP BY p.id, p.name, p.brand
ORDER BY 
    CASE 
        WHEN SUM(v.quantity) = 0 THEN 1
        WHEN EXISTS (
            SELECT 1 FROM product_variants v2 
            WHERE v2.product_id = p.id 
            AND v2.quantity > 0 
            AND v2.quantity <= v2.min_stock_level
        ) THEN 2
        ELSE 3
    END,
    p.name;
```

## Backend Logic Verification

### FashionProduct.java Methods

```java
// Check if product is low stock
public boolean isLowStock() {
    // Returns true if ANY variant has: 0 < quantity <= minStockLevel
    return variants.stream()
        .anyMatch(v -> v.getQuantity() > 0 && v.getQuantity() <= v.getMinStockLevel());
}

// Check if product is out of stock
public boolean isOutOfStock() {
    // Returns true if ALL variants have quantity = 0
    return getTotalStock() == 0 || 
           variants.stream().allMatch(v -> v.getQuantity() == 0);
}
```

### Repository Queries

```java
// Low Stock Query
@Query("SELECT DISTINCT p FROM FashionProduct p JOIN p.variants v 
        WHERE v.quantity > 0 AND v.quantity <= v.minStockLevel")
List<FashionProduct> findLowStockProducts();

// Out of Stock Query
@Query("SELECT DISTINCT p FROM FashionProduct p 
        WHERE NOT EXISTS (SELECT v FROM ProductVariant v 
                         WHERE v.product = p AND v.quantity > 0)")
List<FashionProduct> findOutOfStockProducts();
```

## Frontend Display Logic

### Staff Dashboard Table
```javascript
<td>
  <span className={`status-badge ${
    (product.totalStock || product.quantity) === 0 ? 'status-out' : 
    product.lowStock ? 'status-low' : 'status-good'
  }`}>
    {(product.totalStock || product.quantity) === 0 ? 'Out of Stock' : 
     product.lowStock ? 'Low Stock' : 'In Stock'}
  </span>
</td>
```

### Dashboard Stats Cards
```javascript
// Low Stock Count
stats.put("lowStockProducts", fashionProductService.getLowStockFashionProducts().size());

// Out of Stock Count
stats.put("outOfStockProducts", fashionProductService.getOutOfStockFashionProducts().size());
```

## Testing Scenarios

### Scenario 1: Create Low Stock Situation
```sql
-- Set a variant to low stock
UPDATE product_variants 
SET quantity = 5 
WHERE id = 1 AND min_stock_level = 10;

-- Expected Result:
-- - Product shows "Low Stock" in dashboard
-- - Low Stock count increases by 1
-- - Alert created for this variant
```

### Scenario 2: Create Out of Stock Situation
```sql
-- Set all variants of a product to 0
UPDATE product_variants 
SET quantity = 0 
WHERE product_id = 5;

-- Expected Result:
-- - Product shows "Out of Stock" in dashboard
-- - Out of Stock count increases by 1
-- - Low Stock count decreases (if it was low stock before)
-- - Alert created for out of stock
```

### Scenario 3: Restore Stock to Normal
```sql
-- Increase stock above minimum
UPDATE product_variants 
SET quantity = 50 
WHERE id = 1 AND min_stock_level = 10;

-- Expected Result:
-- - Product shows "In Stock" in dashboard
-- - Low Stock count decreases by 1
-- - Alerts resolved automatically
```

## Verification Checklist

### Backend Verification
- [ ] Run SQL queries to check actual stock levels
- [ ] Verify low stock products match query results
- [ ] Verify out of stock products match query results
- [ ] Check backend logs for accurate counts
- [ ] Verify alerts are created for low/out of stock

### Frontend Verification
- [ ] Dashboard shows correct low stock count
- [ ] Dashboard shows correct out of stock count
- [ ] Product table shows correct status badges
- [ ] Status colors match stock levels (green/orange/red)
- [ ] Stats cards update after stock changes

### API Verification
```bash
# Get staff dashboard data
curl -X GET http://localhost:8888/api/dashboard/staff \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Expected Response:
{
  "products": [...],
  "stats": {
    "totalProducts": 15,
    "lowStockProducts": 3,    // Products with variants at/below minimum
    "outOfStockProducts": 1   // Products with all variants at 0
  }
}
```

## Common Issues and Solutions

### Issue 1: Low Stock Count Shows 0 but Products Exist
**Cause**: Variants might not be loaded (lazy loading)
**Solution**: Use `findByIdWithVariants()` or eager loading

### Issue 2: Out of Stock Count Incorrect
**Cause**: Query not checking all variants
**Solution**: Verify query uses `NOT EXISTS` with proper subquery

### Issue 3: Status Not Updating After Stock Change
**Cause**: Cache or transaction not committed
**Solution**: Add `@Transactional` and refresh dashboard data

### Issue 4: Low Stock Includes Out of Stock
**Cause**: Query missing `v.quantity > 0` condition
**Solution**: Update query to exclude zero quantity variants

## Debug Commands

### Check Backend Logs
```bash
# Look for these log messages:
🔍 Fetching low stock products...
📊 Database query returned X low stock products
  - Product Name (Total Stock: Y, Min Stock: Z)
    ⚠️ Low variant: Size/Color - Qty: A (Min: B)
```

### Test API Endpoints
```bash
# Get all products
GET /api/fashion-products

# Get low stock products
GET /api/fashion-products/low-stock

# Get out of stock products
GET /api/fashion-products/out-of-stock

# Get staff dashboard
GET /api/dashboard/staff
```

## Expected Behavior Summary

| Stock Level | Condition | Dashboard Display | Count Included In |
|-------------|-----------|-------------------|-------------------|
| In Stock | quantity > minStockLevel | Green badge "In Stock" | Total Products only |
| Low Stock | 0 < quantity ≤ minStockLevel | Orange badge "Low Stock" | Low Stock count |
| Out of Stock | quantity = 0 (all variants) | Red badge "Out of Stock" | Out of Stock count |

The system correctly identifies and displays stock status based on variant-level stock quantities compared to minimum stock levels!
