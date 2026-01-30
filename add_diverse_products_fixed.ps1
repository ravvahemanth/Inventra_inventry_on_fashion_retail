# Add More Diverse Fashion Products with Different Categories

Write-Host "Adding Diverse Fashion Products..." -ForegroundColor Cyan

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

Write-Host "Creating products with different categories..." -ForegroundColor Yellow

# Product 1: Women's High Heels (FOOTWEAR_WOMENS)
$heels = @{
    name = "Elegant High Heels"
    sku = "HEELS-ELEGANT-001"
    description = "Stylish high heels perfect for formal occasions"
    category = "FOOTWEAR_WOMENS"
    brand = "HeelCraft"
    basePrice = 2999.00
    season = "ALL_SEASON"
    targetGender = "FEMALE"
    material = "Genuine leather with cushioned sole"
    careInstructions = "Clean with leather cleaner"
    variants = @(
        @{ size = "SIZE_6"; color = "BLACK"; quantity = 12; minStockLevel = 3; priceAdjustment = 0 },
        @{ size = "SIZE_7"; color = "BLACK"; quantity = 15; minStockLevel = 3; priceAdjustment = 0 },
        @{ size = "SIZE_8"; color = "BLACK"; quantity = 10; minStockLevel = 3; priceAdjustment = 0 },
        @{ size = "SIZE_7"; color = "RED"; quantity = 8; minStockLevel = 3; priceAdjustment = 0 }
    )
} | ConvertTo-Json -Depth 3

try {
    $heelsResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Method POST -Body $heels -Headers $headers
    Write-Host "Created: Elegant High Heels (ID: $($heelsResponse.id))" -ForegroundColor Green
} catch {
    Write-Host "Heels creation failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Product 2: Men's Formal Shoes (FOOTWEAR_MENS)
$formalShoes = @{
    name = "Men's Formal Shoes"
    sku = "SHOES-FORMAL-001"
    description = "Classic formal shoes for business and special occasions"
    category = "FOOTWEAR_MENS"
    brand = "FormalStep"
    basePrice = 3999.00
    season = "ALL_SEASON"
    targetGender = "MALE"
    material = "Premium leather with leather sole"
    careInstructions = "Polish regularly, use shoe trees"
    variants = @(
        @{ size = "SIZE_8"; color = "BLACK"; quantity = 18; minStockLevel = 4; priceAdjustment = 0 },
        @{ size = "SIZE_9"; color = "BLACK"; quantity = 22; minStockLevel = 4; priceAdjustment = 0 },
        @{ size = "SIZE_10"; color = "BLACK"; quantity = 16; minStockLevel = 4; priceAdjustment = 0 },
        @{ size = "SIZE_9"; color = "BROWN"; quantity = 14; minStockLevel = 4; priceAdjustment = 0 }
    )
} | ConvertTo-Json -Depth 3

try {
    $shoesResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Method POST -Body $formalShoes -Headers $headers
    Write-Host "Created: Men's Formal Shoes (ID: $($shoesResponse.id))" -ForegroundColor Green
} catch {
    Write-Host "Formal shoes creation failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Product 3: Kids Sneakers (FOOTWEAR_KIDS)
$kidsSneakers = @{
    name = "Kids Colorful Sneakers"
    sku = "SNEAKERS-KIDS-001"
    description = "Fun and comfortable sneakers for active kids"
    category = "FOOTWEAR_KIDS"
    brand = "KidStep"
    basePrice = 1599.00
    season = "ALL_SEASON"
    targetGender = "KIDS"
    material = "Canvas upper with rubber sole"
    careInstructions = "Machine washable, air dry"
    variants = @(
        @{ size = "SIZE_5"; color = "RED"; quantity = 20; minStockLevel = 5; priceAdjustment = 0 },
        @{ size = "SIZE_6"; color = "RED"; quantity = 25; minStockLevel = 5; priceAdjustment = 0 },
        @{ size = "SIZE_7"; color = "BLUE"; quantity = 18; minStockLevel = 5; priceAdjustment = 0 },
        @{ size = "SIZE_6"; color = "PINK"; quantity = 22; minStockLevel = 5; priceAdjustment = 0 }
    )
} | ConvertTo-Json -Depth 3

try {
    $kidsResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Method POST -Body $kidsSneakers -Headers $headers
    Write-Host "Created: Kids Colorful Sneakers (ID: $($kidsResponse.id))" -ForegroundColor Green
} catch {
    Write-Host "Kids sneakers creation failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Product 4: Diamond Jewelry (ACCESSORIES_JEWELRY)
$jewelry = @{
    name = "Diamond Necklace"
    sku = "NECKLACE-DIAMOND-001"
    description = "Elegant diamond necklace for special occasions"
    category = "ACCESSORIES_JEWELRY"
    brand = "DiamondLux"
    basePrice = 15999.00
    season = "ALL_SEASON"
    targetGender = "FEMALE"
    material = "18k gold with genuine diamonds"
    careInstructions = "Store in jewelry box, clean with soft cloth"
    variants = @(
        @{ size = "ONE_SIZE"; color = "GOLD"; quantity = 5; minStockLevel = 2; priceAdjustment = 0 },
        @{ size = "ONE_SIZE"; color = "SILVER"; quantity = 3; minStockLevel = 2; priceAdjustment = 0 }
    )
} | ConvertTo-Json -Depth 3

try {
    $jewelryResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Method POST -Body $jewelry -Headers $headers
    Write-Host "Created: Diamond Necklace (ID: $($jewelryResponse.id))" -ForegroundColor Green
} catch {
    Write-Host "Jewelry creation failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Product 5: Designer Sunglasses (ACCESSORIES_SUNGLASSES)
$sunglasses = @{
    name = "Designer Sunglasses"
    sku = "SUNGLASSES-DESIGNER-001"
    description = "Premium designer sunglasses with UV protection"
    category = "ACCESSORIES_SUNGLASSES"
    brand = "SunStyle"
    basePrice = 3299.00
    season = "SUMMER"
    targetGender = "UNISEX"
    material = "Acetate frame with polarized lenses"
    careInstructions = "Clean with microfiber cloth"
    variants = @(
        @{ size = "ONE_SIZE"; color = "BLACK"; quantity = 8; minStockLevel = 3; priceAdjustment = 0 },
        @{ size = "ONE_SIZE"; color = "BROWN"; quantity = 6; minStockLevel = 3; priceAdjustment = 0 },
        @{ size = "ONE_SIZE"; color = "GOLD"; quantity = 4; minStockLevel = 3; priceAdjustment = 0 }
    )
} | ConvertTo-Json -Depth 3

try {
    $sunglassesResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Method POST -Body $sunglasses -Headers $headers
    Write-Host "Created: Designer Sunglasses (ID: $($sunglassesResponse.id))" -ForegroundColor Green
} catch {
    Write-Host "Sunglasses creation failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Product 6: Fashion Belt (ACCESSORIES_BELTS)
$belt = @{
    name = "Leather Fashion Belt"
    sku = "BELT-LEATHER-001"
    description = "Premium leather belt with designer buckle"
    category = "ACCESSORIES_BELTS"
    brand = "BeltCraft"
    basePrice = 1999.00
    season = "ALL_SEASON"
    targetGender = "UNISEX"
    material = "Genuine leather with metal buckle"
    careInstructions = "Clean with leather conditioner"
    variants = @(
        @{ size = "MEDIUM"; color = "BLACK"; quantity = 15; minStockLevel = 4; priceAdjustment = 0 },
        @{ size = "LARGE"; color = "BLACK"; quantity = 12; minStockLevel = 4; priceAdjustment = 0 },
        @{ size = "MEDIUM"; color = "BROWN"; quantity = 10; minStockLevel = 4; priceAdjustment = 0 }
    )
} | ConvertTo-Json -Depth 3

try {
    $beltResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Method POST -Body $belt -Headers $headers
    Write-Host "Created: Leather Fashion Belt (ID: $($beltResponse.id))" -ForegroundColor Green
} catch {
    Write-Host "Belt creation failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "Diverse products creation completed!" -ForegroundColor Green
Write-Host "Now you should see different icons for each category" -ForegroundColor Cyan