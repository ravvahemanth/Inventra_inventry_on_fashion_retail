# Add More Fashion Products and Create Transactions/Alerts

Write-Host "Adding More Fashion Products and Data..." -ForegroundColor Cyan

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

Write-Host "Creating additional fashion products..." -ForegroundColor Yellow

# Product 1: Summer Floral Dress
$floralDress = @{
    name = "Summer Floral Dress"
    sku = "DRESS-FLORAL-001"
    description = "Light and breezy floral dress perfect for summer"
    category = "CLOTHING_WOMENS"
    brand = "Summer Breeze"
    basePrice = 1599.00
    season = "SUMMER"
    targetGender = "FEMALE"
    material = "Cotton blend with floral print"
    careInstructions = "Machine wash cold, line dry"
    variants = @(
        @{ size = "S"; color = "FLORAL"; quantity = 2; minStockLevel = 10; priceAdjustment = 0 },
        @{ size = "M"; color = "FLORAL"; quantity = 1; minStockLevel = 10; priceAdjustment = 0 },
        @{ size = "L"; color = "FLORAL"; quantity = 0; minStockLevel = 10; priceAdjustment = 0 }
    )
} | ConvertTo-Json -Depth 3

try {
    $dressResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Method POST -Body $floralDress -Headers $headers
    Write-Host "Created: Summer Floral Dress (ID: $($dressResponse.id))" -ForegroundColor Green
} catch {
    Write-Host "Dress creation failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Product 2: Classic Denim Jeans
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
        @{ size = "M"; color = "BLACK"; quantity = 3; minStockLevel = 15; priceAdjustment = 0 },
        @{ size = "L"; color = "BLACK"; quantity = 1; minStockLevel = 15; priceAdjustment = 0 }
    )
} | ConvertTo-Json -Depth 3

try {
    $jeansResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Method POST -Body $jeans -Headers $headers
    Write-Host "Created: Classic Denim Jeans (ID: $($jeansResponse.id))" -ForegroundColor Green
} catch {
    Write-Host "Jeans creation failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Product 3: Running Sports Shoes
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
        @{ size = "SIZE_10"; color = "WHITE"; quantity = 2; minStockLevel = 10; priceAdjustment = 0 },
        @{ size = "SIZE_11"; color = "WHITE"; quantity = 0; minStockLevel = 8; priceAdjustment = 0 }
    )
} | ConvertTo-Json -Depth 3

try {
    $shoesResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Method POST -Body $shoes -Headers $headers
    Write-Host "Created: Running Sports Shoes (ID: $($shoesResponse.id))" -ForegroundColor Green
} catch {
    Write-Host "Shoes creation failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Product 4: Designer Handbag
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
        @{ size = "MEDIUM"; color = "BROWN"; quantity = 1; minStockLevel = 5; priceAdjustment = 0 },
        @{ size = "LARGE"; color = "BLACK"; quantity = 0; minStockLevel = 3; priceAdjustment = 0 }
    )
} | ConvertTo-Json -Depth 3

try {
    $handbagResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Method POST -Body $handbag -Headers $headers
    Write-Host "Created: Designer Handbag (ID: $($handbagResponse.id))" -ForegroundColor Green
} catch {
    Write-Host "Handbag creation failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Product 5: Fashion Watch
$watch = @{
    name = "Fashion Watch"
    sku = "WATCH-FASHION-001"
    description = "Stylish fashion watch with leather strap"
    category = "ACCESSORIES_WATCHES"
    brand = "TimeStyle"
    basePrice = 2799.00
    season = "ALL_SEASON"
    targetGender = "UNISEX"
    material = "Stainless steel case with leather strap"
    careInstructions = "Water resistant, avoid extreme temperatures"
    variants = @(
        @{ size = "ONE_SIZE"; color = "BLACK"; quantity = 12; minStockLevel = 3; priceAdjustment = 0 },
        @{ size = "ONE_SIZE"; color = "BROWN"; quantity = 2; minStockLevel = 8; priceAdjustment = 0 },
        @{ size = "ONE_SIZE"; color = "GOLD"; quantity = 0; minStockLevel = 5; priceAdjustment = 0 }
    )
} | ConvertTo-Json -Depth 3

try {
    $watchResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Method POST -Body $watch -Headers $headers
    Write-Host "Created: Fashion Watch (ID: $($watchResponse.id))" -ForegroundColor Green
} catch {
    Write-Host "Watch creation failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "Creating more stock transactions..." -ForegroundColor Yellow

# Get all fashion products and create more transactions
try {
    $fashionProducts = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Method GET -Headers $headers
    Write-Host "Found $($fashionProducts.Count) fashion products" -ForegroundColor Green
    
    # Create multiple transactions for each product
    foreach ($product in $fashionProducts) {
        if ($product.variants -and $product.variants.Count -gt 0) {
            # Create transactions for multiple variants
            $variantCount = [Math]::Min(3, $product.variants.Count)
            for ($i = 0; $i -lt $variantCount; $i++) {
                $variant = $product.variants[$i]
                
                # Stock IN transaction
                $stockInData = @{
                    type = "STOCK_IN"
                    quantity = (Get-Random -Minimum 5 -Maximum 20)
                    reason = "Inventory replenishment - $($product.name) ($($variant.sizeDisplayName)/$($variant.colorDisplayName))"
                } | ConvertTo-Json
                
                try {
                    Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products/$($product.id)/variants/$($variant.id)/stock" -Method POST -Body $stockInData -Headers $headers
                    Write-Host "  Stock IN: $($product.name) - $($variant.sizeDisplayName)/$($variant.colorDisplayName)" -ForegroundColor Green
                } catch {
                    Write-Host "  Stock IN failed: $($_.Exception.Message)" -ForegroundColor Yellow
                }
                
                # Stock OUT transaction
                $stockOutData = @{
                    type = "STOCK_OUT"
                    quantity = (Get-Random -Minimum 2 -Maximum 8)
                    reason = "Sale transaction - $($product.name) ($($variant.sizeDisplayName)/$($variant.colorDisplayName))"
                } | ConvertTo-Json
                
                try {
                    Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products/$($product.id)/variants/$($variant.id)/stock" -Method POST -Body $stockOutData -Headers $headers
                    Write-Host "  Stock OUT: $($product.name) - $($variant.sizeDisplayName)/$($variant.colorDisplayName)" -ForegroundColor Green
                } catch {
                    Write-Host "  Stock OUT failed: $($_.Exception.Message)" -ForegroundColor Yellow
                }
                
                # Additional transaction as Manager
                Start-Sleep -Milliseconds 100
            }
        }
    }
} catch {
    Write-Host "Failed to create transactions: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Creating transactions as Manager..." -ForegroundColor Yellow

# Login as manager and create some transactions
$managerLoginData = @{
    email = "manager@inventra.com"
    password = "manager123"
} | ConvertTo-Json

try {
    $managerLoginResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/auth/login" -Method POST -Body $managerLoginData -ContentType "application/json"
    $managerToken = $managerLoginResponse.token
    
    $managerHeaders = @{
        "Authorization" = "Bearer $managerToken"
        "Content-Type" = "application/json"
    }
    
    # Create a few transactions as manager
    $fashionProducts = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Method GET -Headers $managerHeaders
    
    foreach ($product in $fashionProducts[0..2]) {  # First 3 products
        if ($product.variants -and $product.variants.Count -gt 0) {
            $variant = $product.variants[0]
            
            $managerStockData = @{
                type = "STOCK_IN"
                quantity = (Get-Random -Minimum 10 -Maximum 25)
                reason = "Manager stock adjustment - Quality check passed"
            } | ConvertTo-Json
            
            try {
                Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products/$($product.id)/variants/$($variant.id)/stock" -Method POST -Body $managerStockData -Headers $managerHeaders
                Write-Host "  Manager Stock IN: $($product.name)" -ForegroundColor Cyan
            } catch {
                Write-Host "  Manager transaction failed: $($_.Exception.Message)" -ForegroundColor Yellow
            }
        }
    }
} catch {
    Write-Host "Manager login/transactions failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "Data creation completed!" -ForegroundColor Green
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "- Added 5 new fashion products with variants" -ForegroundColor White
Write-Host "- Created multiple stock transactions (Admin and Manager)" -ForegroundColor White
Write-Host "- Some products have low/out of stock variants (will trigger alerts)" -ForegroundColor White
Write-Host "- Transaction history now has diverse data" -ForegroundColor White