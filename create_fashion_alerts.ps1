# Create Fashion Product Alerts by Reducing Stock

Write-Host "Creating Fashion Product Alerts..." -ForegroundColor Cyan

# Login as admin
$loginData = @{
    email = "admin@inventra.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Login successful!" -ForegroundColor Green
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "Getting fashion products..." -ForegroundColor Yellow

# Get all fashion products
try {
    $products = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Headers $headers
    Write-Host "Found $($products.Count) fashion products" -ForegroundColor Green
} catch {
    Write-Host "Failed to get fashion products: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Create low stock situations for some products
$alertsCreated = 0

foreach ($product in $products | Select-Object -First 5) {
    Write-Host "Processing product: $($product.name)" -ForegroundColor Yellow
    
    if ($product.variants -and $product.variants.Count -gt 0) {
        # Pick the first variant and reduce its stock to create an alert
        $variant = $product.variants[0]
        
        # Reduce stock to create low stock alert (set to 1 unit)
        $stockRequest = @{
            type = "STOCK_OUT"
            quantity = [Math]::Max(1, $variant.quantity - 1)  # Leave 1 unit to create low stock
            reason = "Creating alert for demonstration - Manager testing"
        } | ConvertTo-Json
        
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products/$($product.id)/variants/$($variant.id)/stock" -Method POST -Body $stockRequest -Headers $headers
            Write-Host "  ✅ Created low stock alert for $($product.name) - $($variant.sizeDisplayName)/$($variant.colorDisplayName)" -ForegroundColor Green
            $alertsCreated++
        } catch {
            Write-Host "  ❌ Failed to create alert for $($product.name): $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
}

# Create out of stock situation for one product
if ($products.Count -gt 0) {
    $product = $products[0]
    if ($product.variants -and $product.variants.Count -gt 1) {
        $variant = $product.variants[1]  # Use second variant
        
        # Remove all stock to create out of stock alert
        $stockRequest = @{
            type = "STOCK_OUT"
            quantity = $variant.quantity
            reason = "Creating out of stock alert for demonstration - Manager testing"
        } | ConvertTo-Json
        
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products/$($product.id)/variants/$($variant.id)/stock" -Method POST -Body $stockRequest -Headers $headers
            Write-Host "  🚨 Created out of stock alert for $($product.name) - $($variant.sizeDisplayName)/$($variant.colorDisplayName)" -ForegroundColor Red
            $alertsCreated++
        } catch {
            Write-Host "  ❌ Failed to create out of stock alert: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
}

Write-Host "Alert creation completed! Created $alertsCreated alerts." -ForegroundColor Green
Write-Host "Check the Manager Alerts page to see the new fashion alerts." -ForegroundColor Cyan