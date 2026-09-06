# Manager Role - Complete Testing Checklist

## 🔧 Issues Found and Fixed

### 1. ✅ ManagerAlerts Navigation
**Issue**: Using `<a href>` causing page reloads  
**Fixed**: Changed to `onClick` with `navigate()`  
**Routes Fixed**: 
- Stock Management: `/admin/fashion-stock` → `/manager/stock`
- Transactions: `/admin/transactions` → `/transactions`

### 2. ✅ FashionProductDetail Navigation
**Issue**: Using `<a href>` and wrong routes for manager  
**Fixed**: Changed to `onClick` with role-based routing  
**Added**: Manager access to Stock Management and Alerts

### 3. ✅ FashionProductDetail Stock Actions
**Issue**: Stock In/Out buttons only for ADMIN  
**Fixed**: Added MANAGER access to Stock In/Out buttons  
**Result**: Managers can now manage stock from product detail page

### 4. ✅ Dashboard Min Stock Display
**Added**: Min Stock column in fashion collection table  
**Added**: Min stock info in fashion product cards

## 📋 Complete Manager Role Test Checklist

### Prerequisites
- Backend running on port 8888
- Frontend running on port 5174 (or 5173)
- Login: manager@inventra.com / manager123

---

## Test 1: Login and Dashboard

### Steps:
1. Navigate to http://localhost:5174/login
2. Enter email: manager@inventra.com
3. Enter password: manager123
4. Click "Login"

### Expected Results:
- ✅ Successfully logged in
- ✅ Redirected to dashboard
- ✅ See "👗 Fashion Retail Manager" title
- ✅ See role indicator: "👔 Manager"

### Dashboard Stats to Verify:
- ✅ Fashion Items count (should match database)
- ✅ Low Stock count (products with stock ≤ min stock)
- ✅ Out of Stock count (products with 0 stock)
- ✅ Active Alerts count (ACTIVE status alerts)

### Dashboard Table to Check:
- ✅ Product Name column
- ✅ Brand column
- ✅ Category column
- ✅ Season column
- ✅ Total Stock column
- ✅ **Min Stock column** (newly added)
- ✅ Status column
- ✅ Base Price column

---

## Test 2: Navigation from Dashboard

### Test All Sidebar Links:

#### 2.1 Fashion Collection
- Click "👗 Fashion Collection"
- ✅ Should navigate to `/fashion`
- ✅ No page reload
- ✅ URL changes in address bar

#### 2.2 Stock Management
- Click "📦 Stock Management"
- ✅ Should navigate to `/manager/stock`
- ✅ Shows fashion products with stock levels
- ✅ Stock In/Out buttons visible

#### 2.3 Stock Alerts
- Click "🔔 Stock Alerts"
- ✅ Should navigate to `/manager/alerts`
- ✅ Shows active alerts
- ✅ Alert count matches dashboard

#### 2.4 Transaction History
- Click "📝 Transaction History"
- ✅ Should navigate to `/transactions`
- ✅ Shows all transactions
- ✅ Export buttons visible

#### 2.5 Back to Dashboard
- Click "📊 Dashboard"
- ✅ Should navigate back to `/dashboard`
- ✅ Stats refresh correctly

### Verify Manager Restrictions:
- ❌ Should NOT see "➕ Add Fashion Items"
- ❌ Should NOT see "👥 User Management"

---

## Test 3: Fashion Collection Page

### Navigation Test:
1. Go to Fashion Collection
2. Open sidebar (☰)
3. Test each menu item

### Expected Sidebar Items:
- ✅ Dashboard
- ✅ Fashion Collection (active)
- ✅ Stock Management
- ✅ Stock Alerts
- ✅ Transaction History
- ❌ NOT "Add Fashion Items"
- ❌ NOT "User Management"

### Product Cards to Check:
- ✅ Product name and brand
- ✅ Category and season badges
- ✅ Material information
- ✅ Variants preview
- ✅ Base price
- ✅ Stock status (In Stock/Low Stock/Out of Stock)
- ✅ **Stock display: "X units | Min: Y"** (newly added)
- ✅ "👁️ View Details" button
- ✅ "📦 View Stock" button (for managers)

### Actions to Test:
1. Click "👁️ View Details" on any product
   - ✅ Should navigate to product detail page
   - ✅ Should show full product information

2. Click "📦 View Stock"
   - ✅ Should navigate to `/manager/stock`

---

## Test 4: Product Detail Page

### Navigation:
1. From Fashion Collection, click "View Details" on any product
2. Should navigate to `/fashion/product/{id}`

### Page Elements to Verify:
- ✅ Product name and brand
- ✅ Category, season, gender badges
- ✅ Description
- ✅ Material and care instructions
- ✅ Base price
- ✅ All variants listed with:
  - Size and color
  - Quantity
  - Min stock level
  - Price adjustment
  - SKU

### Stock Management Actions (NEW for Manager):
- ✅ **Stock In button visible** for each variant
- ✅ **Stock Out button visible** for each variant
- ✅ Stock Out disabled if quantity = 0

### Test Stock In:
1. Click "📦 Stock In" on any variant
2. Modal should open
3. Select action: "Stock In"
4. Enter quantity (e.g., 10)
5. Enter reason (e.g., "New shipment")
6. Click "Update Stock"
7. ✅ Success message appears
8. ✅ Variant quantity updates
9. ✅ Page refreshes with new data

### Test Stock Out:
1. Click "📤 Stock Out" on variant with stock
2. Modal should open
3. Select action: "Stock Out"
4. Enter quantity less than available (e.g., 5)
5. Enter reason (e.g., "Sold to customer")
6. Click "Update Stock"
7. ✅ Success message appears
8. ✅ Variant quantity decreases
9. ✅ Page refreshes with new data

### Test Stock Out Validation:
1. Click "📤 Stock Out"
2. Try to enter quantity MORE than available
3. ✅ Should show error message
4. ✅ Should prevent invalid operation

### Sidebar Navigation from Product Detail:
- ✅ Dashboard
- ✅ Fashion Collection
- ✅ Stock Management (goes to `/manager/stock`)
- ✅ Stock Alerts (goes to `/manager/alerts`)
- ✅ Transaction History
- ❌ NOT "Add Fashion Items"
- ❌ NOT "User Management"

---

## Test 5: Stock Management Page

### Navigation:
- From dashboard or sidebar, click "📦 Stock Management"
- Should navigate to `/manager/stock`

### Page Elements:
- ✅ Title: "👗 Fashion Stock Management"
- ✅ Subtitle: "Monitor fashion product inventory levels"
- ✅ Table with all fashion products

### Table Columns:
- ✅ Product Name
- ✅ Brand
- ✅ Category
- ✅ Season
- ✅ Total Stock
- ✅ Status (In Stock/Low Stock/Out of Stock)
- ✅ Base Price
- ✅ Actions (Stock In/Out buttons)

### Test Stock In:
1. Click "📥 Stock In" on any product
2. Modal opens
3. Select variant from dropdown
4. Enter quantity (e.g., 10)
5. Enter reason (e.g., "Restocking")
6. Click "📥 Add Stock"
7. ✅ Success message
8. ✅ Stock count updates
9. ✅ Table refreshes

### Test Stock Out:
1. Click "📤 Stock Out" on product with stock
2. Modal opens
3. Select variant
4. Enter quantity less than available
5. Enter reason (e.g., "Customer purchase")
6. Click "📤 Remove Stock"
7. ✅ Success message
8. ✅ Stock count decreases
9. ✅ Table refreshes

### Test Validation:
1. Try Stock Out with quantity > available
2. ✅ Should show error: "Insufficient stock!"
3. ✅ Should display available vs requested

### Sidebar Navigation:
- ✅ All links work without page reload
- ✅ Routes are correct for manager

---

## Test 6: Stock Alerts Page

### Navigation:
- Click "🔔 Stock Alerts" from any page
- Should navigate to `/manager/alerts`

### Page Elements:
- ✅ Title: "🔔 Fashion Stock Alerts"
- ✅ Alert statistics
- ✅ Filter options
- ✅ Alert list

### Alert Information:
- ✅ Product name
- ✅ Alert type (Low Stock/Out of Stock)
- ✅ Current stock level
- ✅ Minimum stock level
- ✅ Alert status (ACTIVE/RESOLVED)
- ✅ Created date

### Actions to Test:
1. View alert details
2. Filter by type
3. Filter by status
4. Search alerts

### Sidebar Navigation:
- ✅ Dashboard
- ✅ Fashion Collection
- ✅ Stock Management
- ✅ Stock Alerts (active)
- ✅ Transaction History

---

## Test 7: Transaction History Page

### Navigation:
- Click "📝 Transaction History"
- Should navigate to `/transactions`

### Page Elements:
- ✅ Title: "📝 Transaction History"
- ✅ Transaction statistics
- ✅ Filter options
- ✅ Search box
- ✅ Export buttons (for manager)

### Transaction Display:
- ✅ Transaction type (Stock In/Out)
- ✅ Product name
- ✅ Quantity
- ✅ User who performed action
- ✅ Reason/notes
- ✅ Date and time
- ✅ Transaction ID

### Filters to Test:
1. Search by product name
2. Filter by action type (Stock In/Out)
3. Filter by date range
4. ✅ All filters work correctly

### Export Functionality:
1. Click "📊 Export Transactions"
2. Select date range (optional)
3. Click "Export"
4. ✅ CSV file downloads
5. ✅ Contains correct data

### Sidebar Navigation:
- ✅ All links work
- ✅ No page reloads
- ✅ Correct routes for manager

---

## Test 8: Cross-Page Navigation

### Test Navigation Flow:
1. Dashboard → Fashion Collection → Product Detail → Stock Management → Alerts → Transactions → Dashboard
2. ✅ All transitions smooth
3. ✅ No page reloads
4. ✅ Browser back button works
5. ✅ URL updates correctly

### Test from Each Page:
- From Dashboard: Navigate to all 4 pages
- From Fashion Collection: Navigate to all pages
- From Product Detail: Navigate to all pages
- From Stock Management: Navigate to all pages
- From Alerts: Navigate to all pages
- From Transactions: Navigate to all pages

### Expected:
- ✅ All navigation works
- ✅ No 404 errors
- ✅ No permission errors
- ✅ Correct pages load

---

## Test 9: Role Restrictions

### Manager SHOULD See:
- ✅ Dashboard
- ✅ Fashion Collection
- ✅ Product Details
- ✅ Stock Management
- ✅ Stock Alerts
- ✅ Transaction History
- ✅ Stock In/Out buttons
- ✅ Export buttons

### Manager SHOULD NOT See:
- ❌ Add Fashion Items menu
- ❌ User Management menu
- ❌ Add Product button
- ❌ Edit Product button
- ❌ Delete Product button
- ❌ Admin-only features

### Test Restrictions:
1. Try to manually navigate to `/fashion/add-product`
   - ✅ Should redirect or show access denied

2. Try to manually navigate to `/admin/users`
   - ✅ Should redirect or show access denied

3. Check all pages for admin-only buttons
   - ✅ Should not be visible

---

## Test 10: Data Accuracy

### Dashboard Stats:
1. Note dashboard stats
2. Run SQL verification:
```sql
SELECT 
    (SELECT COUNT(*) FROM fashion_products) AS total,
    (SELECT COUNT(DISTINCT fp.id) FROM fashion_products fp 
     JOIN product_variants pv ON pv.fashion_product_id = fp.id 
     WHERE pv.quantity > 0 AND pv.quantity <= pv.min_stock_level) AS low_stock,
    (SELECT COUNT(DISTINCT fp.id) FROM fashion_products fp 
     WHERE NOT EXISTS (SELECT 1 FROM product_variants pv 
                       WHERE pv.fashion_product_id = fp.id AND pv.quantity > 0)) AS out_of_stock,
    (SELECT COUNT(*) FROM fashion_alerts WHERE status = 'ACTIVE') AS active_alerts;
```
3. ✅ Dashboard stats should match SQL results

### Stock Levels:
1. Note stock level for a product
2. Perform Stock In operation
3. ✅ Stock should increase by entered amount
4. Perform Stock Out operation
5. ✅ Stock should decrease by entered amount

### Transactions:
1. Perform stock operation
2. Check transaction history
3. ✅ New transaction should appear
4. ✅ Details should be correct

---

## Test 11: Error Handling

### Test Invalid Operations:
1. Try Stock Out with insufficient stock
   - ✅ Should show error message
   - ✅ Should not update stock

2. Try Stock In with invalid quantity (0 or negative)
   - ✅ Should show validation error

3. Try Stock Out without selecting variant
   - ✅ Should show "Please select variant" error

4. Try Stock In without reason
   - ✅ Should show "Please enter reason" error

### Test Network Errors:
1. Stop backend server
2. Try to perform stock operation
3. ✅ Should show connection error
4. ✅ Should not crash application

---

## Test 12: UI/UX

### Responsiveness:
1. Test on desktop (1920x1080)
   - ✅ All elements visible
   - ✅ Layout looks good

2. Test on tablet (768x1024)
   - ✅ Sidebar becomes mobile menu
   - ✅ Tables scroll horizontally
   - ✅ Cards stack properly

3. Test on mobile (375x667)
   - ✅ Mobile menu works
   - ✅ All features accessible
   - ✅ Touch targets adequate

### Visual Feedback:
- ✅ Buttons have hover effects
- ✅ Loading spinners show during operations
- ✅ Success messages are green
- ✅ Error messages are red
- ✅ Active menu items highlighted

### Performance:
- ✅ Pages load quickly
- ✅ No lag when navigating
- ✅ Stock operations complete in < 2 seconds
- ✅ No memory leaks

---

## 🎯 Summary Checklist

### Core Functionality:
- [ ] Login works
- [ ] Dashboard displays correctly
- [ ] Dashboard stats are accurate
- [ ] Min Stock column visible
- [ ] All navigation works without page reload
- [ ] Fashion Collection displays products
- [ ] Product Detail shows full information
- [ ] Stock In works correctly
- [ ] Stock Out works correctly
- [ ] Stock validation prevents errors
- [ ] Alerts display correctly
- [ ] Transactions display correctly
- [ ] Export functionality works
- [ ] Role restrictions enforced

### Navigation:
- [ ] Dashboard → All pages
- [ ] Fashion Collection → All pages
- [ ] Product Detail → All pages
- [ ] Stock Management → All pages
- [ ] Alerts → All pages
- [ ] Transactions → All pages
- [ ] Browser back button works
- [ ] No 404 errors

### Manager Permissions:
- [ ] Can view all products
- [ ] Can view product details
- [ ] Can perform Stock In
- [ ] Can perform Stock Out
- [ ] Can view alerts
- [ ] Can view transactions
- [ ] Can export data
- [ ] Cannot add products
- [ ] Cannot edit products
- [ ] Cannot delete products
- [ ] Cannot manage users

### Data Integrity:
- [ ] Stats match database
- [ ] Stock updates correctly
- [ ] Transactions recorded
- [ ] Alerts generated
- [ ] No data loss

---

## 🐛 Known Issues (if any)

_Document any issues found during testing here_

---

## ✅ Test Results

**Date**: _____________  
**Tester**: _____________  
**Environment**: _____________  

**Overall Status**: ⬜ Pass / ⬜ Fail  

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________
