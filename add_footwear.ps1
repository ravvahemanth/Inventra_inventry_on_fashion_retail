# Add Footwear Products with Unique SKUs

Write-Host "Adding Footwear Products..." -ForegroundColor Cyan

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

# Product 1: Women's High Heels (FOOTWEAR_WOMENS)
$heels = @{
    name = "Elegant High Heels"
    sku = "HEELS-ELEGANT-002"
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
        @{ size = "SIZE_7"; color = "BLACK"; quantity = 15; minStockLevel = 3; priceAdjustment = 0 }
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
    sku = "SHOES-FORMAL-002"
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
        @{ size = "SIZE_9"; color = "BLACK"; quantity = 22; minStockLevel = 4; priceAdjustment = 0 }
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
    sku = "SNEAKERS-KIDS-002"
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
        @{ size = "SIZE_6"; color = "RED"; quantity = 25; minStockLevel = 5; priceAdjustment = 0 }
    )
} | ConvertTo-Json -Depth 3

try {
    $kidsResponse = Invoke-RestMethod -Uri "http://localhost:8888/api/fashion-products" -Method POST -Body $kidsSneakers -Headers $headers
    Write-Host "Created: Kids Colorful Sneakers (ID: $($kidsResponse.id))" -ForegroundColor Green
} catch {
    Write-Host "Kids sneakers creation failed: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "Footwear products creation completed!" -ForegroundColor Green