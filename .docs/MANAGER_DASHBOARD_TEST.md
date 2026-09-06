# Manager Dashboard Testing Guide

## Current Issue
The Manager Dashboard is showing incorrect statistics that don't match the database:
- Fashion Items count
- Low Stock count  
- Out of Stock count
- Active Alerts count

## Testing Steps

### 1. Verify Database State
Run the SQL verification script to see actual counts:
```bash
mysql -u root -p fashion_retail_db < verify_dashboard_stats.sql
```

### 2. Test Manager Dashboard Navigation

#### Login as Manager
- URL: http://localhost:5174/login (or 5173)
- Email: manager@inventra.com
- Password: manager123

#### Check Dashboard Stats
After login, verify the dashboard shows:
- **Fashion Items**: Should match total products in database
- **Low Stock**: Products with variants where `quantity > 0 AND quantity <= min_stock_level`
- **Out of Stock**: Products where ALL variants have `quantity = 0`
- **Active Alerts**: Count of alerts with `status = 'ACTIVE'`

### 3. Test Navigation Links

From Manager Dashboard, test these navigation items:

#### Sidebar Menu
1. **📊 Dashboard** → Should stay on `/dashboard`
2. **👗 Fashion Collection** → Should go to `/fashion`
3. **📦 Stock Management** → Should go to `/manager/stock`
4. **📋 Transaction History** → Should go to `/transactions`
5. **🔔 Stock Alerts** → Should go to `/manager/alerts`

#### Dashboard Buttons
1. **View Collection** button → Should go to `/fashion`
2. **View All** (transactions) button → Should go to `/transactions`
3. **View All Alerts** button → Should go to `/manager/alerts`
4. **View Stock Alerts** (banner) → Should go to `/manager/alerts`

### 4. Test Stock Management Page

Navigate to Stock Management (`/manager/stock`):

#### Expected Features
- ✅ View all fashion products with stock levels
- ✅ Stock In button for each product
- ✅ Stock Out button for each product (disabled if out of stock)
- ✅ Modal to select variant (size/color)
- ✅ Quantity input with validation
- ✅ Reason input field
- ✅ Success/error messages

#### Test Stock In
1. Click "📥 Stock In" on any product
2. Select a variant from dropdown
3. Enter quantity (e.g., 10)
4. Enter reason (e.g., "New shipment received")
5. Click "📥 Add Stock"
6. Verify success message
7. Check that stock count updated

#### Test Stock Out
1. Click "📤 Stock Out" on a product with stock
2. Select a variant
3. Enter quantity LESS than available stock
4. Enter reason (e.g., "Sold to customer")
5. Click "📤 Remove Stock"
6. Verify success message

#### Test Stock Out Validation
1. Click "📤 Stock Out"
2. Select a variant with 5 units
3. Try to remove 10 units
4. Should show error: "❌ Insufficient stock! Available: 5 units, Requested: 10 units"

### 5. Check Backend Logs

Look for these log messages in the backend console:

```
📊 Manager dashboard response: ...
🔔 Alert count: X active alerts out of Y total
🔍 Fetching low stock products...
📊 Database query returned X low stock products
🔍 Fetching out of stock products...
📊 Database query returned X out of stock products
```

### 6. Common Issues and Solutions

#### Issue: Stats don't match database
**Solution**: Check if the repository queries are correct:
- Low Stock: `v.quantity > 0 AND v.quantity <= v.minStockLevel`
- Out of Stock: No variants with `quantity > 0`

#### Issue: Navigation not working
**Solution**: Verify routes in `App.jsx`:
- `/manager/stock` → StockManagement component
- `/manager/alerts` → ManagerAlerts component
- Both should have `allowedRoles={['ADMIN', 'MANAGER']}`

#### Issue: Stock In/Out not working
**Solution**: Check backend permissions:
- StockTransactionController should have `@PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")`

#### Issue: Alert count wrong
**Solution**: Verify only ACTIVE alerts are counted:
```java
List<AlertResponse> activeAlerts = alertService.getAllActiveAlerts();
stats.put("activeAlerts", activeAlerts.size());
```

## Expected Behavior Summary

### Manager Role Permissions
✅ **CAN DO:**
- View all fashion products
- View stock levels and variants
- Add stock (Stock In)
- Remove stock (Stock Out)
- View transaction history
- View stock alerts
- View reports

❌ **CANNOT DO:**
- Add new products
- Edit product details
- Delete products
- Manage users
- Change system settings

### Dashboard Stats Calculation
- **Fashion Items**: `COUNT(*)` from `fashion_products`
- **Low Stock**: `COUNT(DISTINCT fp.id)` where any variant has `quantity > 0 AND quantity <= min_stock_level`
- **Out of Stock**: `COUNT(DISTINCT fp.id)` where ALL variants have `quantity = 0`
- **Active Alerts**: `COUNT(*)` from `fashion_alerts` where `status = 'ACTIVE'`

## Debugging Commands

### Check Backend API Response
```powershell
# Get manager dashboard data (replace TOKEN with actual JWT)
Invoke-RestMethod -Uri "http://localhost:8888/api/dashboard/manager" -Headers @{Authorization="Bearer TOKEN"}
```

### Check Database Directly
```sql
-- Quick stats check
SELECT 
    (SELECT COUNT(*) FROM fashion_products) AS total_products,
    (SELECT COUNT(DISTINCT fp.id) FROM fashion_products fp JOIN product_variants pv ON pv.fashion_product_id = fp.id WHERE pv.quantity > 0 AND pv.quantity <= pv.min_stock_level) AS low_stock,
    (SELECT COUNT(DISTINCT fp.id) FROM fashion_products fp WHERE NOT EXISTS (SELECT 1 FROM product_variants pv WHERE pv.fashion_product_id = fp.id AND pv.quantity > 0)) AS out_of_stock,
    (SELECT COUNT(*) FROM fashion_alerts WHERE status = 'ACTIVE') AS active_alerts;
```

## Next Steps After Testing

1. Run the SQL verification script
2. Login as manager and check dashboard stats
3. Compare dashboard numbers with SQL results
4. Test all navigation links
5. Test stock in/out functionality
6. Report any discrepancies with:
   - Expected value (from SQL)
   - Actual value (from dashboard)
   - Screenshot if possible
