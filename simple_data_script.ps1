# Simple Fashion Retail Data Creation Script

Write-Host "Fashion Retail Data Creation Script" -ForegroundColor Cyan

# Login as admin
$loginData = @{
    email = "admin@inventra.com"
    password = "admin123"
} | ConvertTo-Json

Write-Host "Logging in as admin..." -ForegroundColor Yellow

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Login successful!" -ForegroundColor Green
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Create headers with token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "Creating sample stock transactions..." -ForegroundColor Yellow

# Get all fashion products
try {
    $fashionProducts = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Method GET -Headers $headers
    Write-Host "Found $($fashionProducts.Count) fashion products" -ForegroundColor Green
    
    # Create sample transactions for each product
    foreach ($product in $fashionProducts) {
        if ($product.variants -and $product.variants.Count -gt 0) {
            $variant = $product.variants[0]  # Use first variant
            
            # Stock IN transaction
            $stockInData = @{
                type = "STOCK_IN"
                quantity = 15
                reason = "New shipment - $($product.name)"
            } | ConvertTo-Json
            
            try {
                Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products/$($product.id)/variants/$($variant.id)/stock" -Method POST -Body $stockInData -Headers $headers
                Write-Host "  Stock IN: $($product.name)" -ForegroundColor Green
            } catch {
                Write-Host "  Stock IN failed for $($product.name): $($_.Exception.Message)" -ForegroundColor Yellow
            }
            
            # Stock OUT transaction
            $stockOutData = @{
                type = "STOCK_OUT"
                quantity = 5
                reason = "Customer purchase - $($product.name)"
            } | ConvertTo-Json
            
            try {
                Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products/$($product.id)/variants/$($variant.id)/stock" -Method POST -Body $stockOutData -Headers $headers
                Write-Host "  Stock OUT: $($product.name)" -ForegroundColor Green
            } catch {
                Write-Host "  Stock OUT failed for $($product.name): $($_.Exception.Message)" -ForegroundColor Yellow
            }
        }
    }
} catch {
    Write-Host "Failed to get fashion products: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Data creation completed!" -ForegroundColor Cyan
Write-Host "You can now test the system at http://localhost:5173" -ForegroundColor Green