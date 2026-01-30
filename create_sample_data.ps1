# Fashion Retail Data Creation Script
# This script creates sample fashion products and transactions

Write-Host "Fashion Retail Data Creation Script" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# First, let's login as admin to get a token
$loginData = @{
    email = "admin@inventra.com"
    password = "admin123"
} | ConvertTo-Json

Write-Host "Logging in as admin..." -ForegroundColor Yellow

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Login successful! Token obtained." -ForegroundColor Green
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Create headers with token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "Creating additional fashion products..." -ForegroundColor Yellow

# Fashion Product 4: Classic Denim Jeans
$jeans = @{
    name = "Classic Denim Jeans"
    sku = "JEANS-CLASSIC-001"
    description = "Timeless denim jeans with perfect fit"
    category = "CLOTHING_MENS"
    brand = "DenimCraft"
    basePrice = 1899.00
    season = "ALL_SEASON"
    targetGender = "UNISEX"
    material = "100% Cotton Denim"
    careInstructions = "Machine wash cold, hang dry"
    variants = @(
        @{ size = "S"; color = "BLUE"; quantity = 22; minStockLevel = 5; priceAdjustment = 0 },
        @{ size = "M"; color = "BLUE"; quantity = 28; minStockLevel = 5; priceAdjustment = 0 },
        @{ size = "L"; color = "BLUE"; quantity = 25; minStockLevel = 5; priceAdjustment = 0 },
        @{ size = "XL"; color = "BLUE"; quantity = 20; minStockLevel = 5; priceAdjustment = 0 },
        @{ size = "M"; color = "BLACK"; quantity = 15; minStockLevel = 5; priceAdjustment = 0 },
        @{ size = "L"; color = "BLACK"; quantity = 18; minStockLevel = 5; priceAdjustment = 0 }
    )
} | ConvertTo-Json -Depth 3

try {
    $jeansResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Method POST -Body $jeans -Headers $headers
    Write-Host "Created: Classic Denim Jeans (ID: $($jeansResponse.id))" -ForegroundColor Green
} catch {
    Write-Host "Jeans creation failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Fashion Product 5: Running Sports Shoes
$shoes = @{
    name = "Running Sports Shoes"
    sku = "SHOES-RUNNING-001"
    description = "Lightweight running shoes with excellent cushioning"
    category = "FOOTWEAR_MENS"
    brand = "SportMax"
    basePrice = 3499.00
    season = "ALL_SEASON"
    targetGender = "UNISEX"
    material = "Mesh upper with rubber sole"
    careInstructions = "Wipe clean with damp cloth"
    variants = @(
        @{ size = "SIZE_8"; color = "BLACK"; quantity = 15; minStockLevel = 3; priceAdjustment = 0 },
        @{ size = "SIZE_9"; color = "BLACK"; quantity = 20; minStockLevel = 3; priceAdjustment = 0 },
        @{ size = "SIZE_10"; color = "BLACK"; quantity = 18; minStockLevel = 3; priceAdjustment = 0 },
        @{ size = "SIZE_8"; color = "WHITE"; quantity = 12; minStockLevel = 3; priceAdjustment = 0 },
        @{ size = "SIZE_9"; color = "WHITE"; quantity = 16; minStockLevel = 3; priceAdjustment = 0 },
        @{ size = "SIZE_10"; color = "WHITE"; quantity = 14; minStockLevel = 3; priceAdjustment = 0 }
    )
} | ConvertTo-Json -Depth 3

try {
    $shoesResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Method POST -Body $shoes -Headers $headers
    Write-Host "✅ Created: Running Sports Shoes (ID: $($shoesResponse.id))" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Shoes creation failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Fashion Product 6: Designer Handbag
$handbag = @{
    name = "Designer Handbag"
    sku = "BAG-DESIGNER-001"
    description = "Elegant designer handbag with premium finish"
    category = "ACCESSORIES_BAGS"
    brand = "LuxeStyle"
    basePrice = 4999.00
    season = "ALL_SEASON"
    targetGender = "FEMALE"
    material = "Genuine leather with gold hardware"
    careInstructions = "Clean with leather conditioner"
    variants = @(
        @{ size = "MEDIUM"; color = "BLACK"; quantity = 8; minStockLevel = 2; priceAdjustment = 0 },
        @{ size = "MEDIUM"; color = "BROWN"; quantity = 6; minStockLevel = 2; priceAdjustment = 0 },
        @{ size = "MEDIUM"; color = "BEIGE"; quantity = 5; minStockLevel = 2; priceAdjustment = 0 },
        @{ size = "LARGE"; color = "BLACK"; quantity = 4; minStockLevel = 2; priceAdjustment = 0 }
    )
} | ConvertTo-Json -Depth 3

try {
    $handbagResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Method POST -Body $handbag -Headers $headers
    Write-Host "✅ Created: Designer Handbag (ID: $($handbagResponse.id))" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Handbag creation failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Fashion Product 7: Winter Wool Sweater
$sweater = @{
    name = "Winter Wool Sweater"
    sku = "SWEATER-WOOL-001"
    description = "Cozy wool sweater for cold weather"
    category = "CLOTHING_MENS"
    brand = "WarmWear"
    basePrice = 2299.00
    season = "WINTER"
    targetGender = "UNISEX"
    material = "100% Merino Wool"
    careInstructions = "Hand wash cold, lay flat to dry"
    variants = @(
        @{ size = "M"; color = "GRAY"; quantity = 14; minStockLevel = 3; priceAdjustment = 0 },
        @{ size = "L"; color = "GRAY"; quantity = 16; minStockLevel = 3; priceAdjustment = 0 },
        @{ size = "XL"; color = "GRAY"; quantity = 12; minStockLevel = 3; priceAdjustment = 0 },
        @{ size = "M"; color = "NAVY"; quantity = 10; minStockLevel = 3; priceAdjustment = 0 },
        @{ size = "L"; color = "NAVY"; quantity = 12; minStockLevel = 3; priceAdjustment = 0 }
    )
} | ConvertTo-Json -Depth 3

try {
    $sweaterResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Method POST -Body $sweater -Headers $headers
    Write-Host "✅ Created: Winter Wool Sweater (ID: $($sweaterResponse.id))" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Sweater creation failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "📦 Creating sample stock transactions..." -ForegroundColor Yellow

# Get all fashion products to create transactions
try {
    $fashionProducts = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Method GET -Headers $headers
    Write-Host "📋 Found $($fashionProducts.Count) fashion products" -ForegroundColor Green
    
    # Create sample transactions for each product
    foreach ($product in $fashionProducts) {
        if ($product.variants -and $product.variants.Count -gt 0) {
            # Create 2-3 transactions per product
            $variant = $product.variants[0]  # Use first variant
            
            # Stock IN transaction
            $stockInData = @{
                type = "STOCK_IN"
                quantity = 10
                reason = "New shipment received - $($product.name)"
            } | ConvertTo-Json
            
            try {
                $stockInResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products/$($product.id)/variants/$($variant.id)/stock" -Method POST -Body $stockInData -Headers $headers
                Write-Host "  ✅ Stock IN: $($product.name) - $($variant.sizeDisplayName)/$($variant.colorDisplayName)" -ForegroundColor Green
            } catch {
                Write-Host "  ⚠️ Stock IN failed for $($product.name): $($_.Exception.Message)" -ForegroundColor Yellow
            }
            
            # Stock OUT transaction
            $stockOutData = @{
                type = "STOCK_OUT"
                quantity = 3
                reason = "Customer purchase - $($product.name)"
            } | ConvertTo-Json
            
            try {
                $stockOutResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products/$($product.id)/variants/$($variant.id)/stock" -Method POST -Body $stockOutData -Headers $headers
                Write-Host "  ✅ Stock OUT: $($product.name) - $($variant.sizeDisplayName)/$($variant.colorDisplayName)" -ForegroundColor Green
            } catch {
                Write-Host "  ⚠️ Stock OUT failed for $($product.name): $($_.Exception.Message)" -ForegroundColor Yellow
            }
        }
    }
} catch {
    Write-Host "❌ Failed to get fashion products: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🎉 Data creation completed!" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "✅ Fashion products created and stock transactions added" -ForegroundColor Green
Write-Host "🌐 You can now test the system at http://localhost:5173" -ForegroundColor Green
Write-Host "🔐 Login credentials:" -ForegroundColor Yellow
Write-Host "   Admin: admin@inventra.com / admin123" -ForegroundColor White
Write-Host "   Manager: manager@inventra.com / manager123" -ForegroundColor White
Write-Host "   Staff: staff@inventra.com / staff123" -ForegroundColor White