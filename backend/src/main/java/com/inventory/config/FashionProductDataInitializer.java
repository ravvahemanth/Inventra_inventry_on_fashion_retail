package com.inventory.config;

import com.inventory.model.*;
import com.inventory.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@Order(1) // Run first to initialize real-world fashion data
public class FashionProductDataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FashionProductRepository fashionProductRepository;

    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private StockTransactionRepository stockTransactionRepository;

    @Autowired
    private FashionAlertRepository fashionAlertRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("==========================================================");
        System.out.println("👗 INVENTRA FASHION RETAIL - SEEDING REAL-WORLD DATA...");
        System.out.println("==========================================================");

        // 1. Initialize Default Approved Accounts
        User admin = initUser("admin", "admin@inventra.com", "admin123", User.Role.ADMIN);
        User manager = initUser("manager", "manager@inventra.com", "manager123", User.Role.MANAGER);
        User staff = initUser("staff", "staff@inventra.com", "staff123", User.Role.STAFF);

        // Purge dummy/legacy test products (e.g., laptops, printers, mice)
        cleanLegacyTestData();

        // 2. Seed Real Fashion Catalog if empty or legacy
        if (fashionProductRepository.count() == 0) {
            seedRealFashionCatalog(admin, manager, staff);
            System.out.println("✅ Real-world Fashion Catalog & Variants Successfully Seeded!");
        } else {
            System.out.println("✅ Fashion Catalog already populated (" + fashionProductRepository.count() + " products).");
        }

        System.out.println("==========================================================");
        System.out.println("🎉 FASHION RETAIL DATABASE IS LIVE & FULLY OPERATIONAL!");
        System.out.println("==========================================================");
    }

    private User initUser(String username, String email, String password, User.Role role) {
        return userRepository.findByUsername(username).orElseGet(() -> {
            User u = new User();
            u.setUsername(username);
            u.setEmail(email);
            u.setPassword(passwordEncoder.encode(password));
            u.setRole(role);
            u.setStatus(User.UserStatus.APPROVED);
            return userRepository.save(u);
        });
    }

    private void cleanLegacyTestData() {
        try {
            List<Product> legacyProducts = productRepository.findAll();
            for (Product p : legacyProducts) {
                String name = p.getName() != null ? p.getName().toLowerCase() : "";
                if (name.contains("laptop") || name.contains("printer") || name.contains("mouse")
                        || name.contains("desk") || name.contains("chair") || name.contains("pen")
                        || name.contains("notebook") || name.contains("marker") || name.contains("usb")) {
                    System.out.println("🧹 Purging legacy dummy test item: " + p.getName());
                    
                    // 1. Delete referencing alerts first
                    try {
                        List<Alert> relatedAlerts = alertRepository.findByProduct(p);
                        if (!relatedAlerts.isEmpty()) {
                            alertRepository.deleteAll(relatedAlerts);
                        }
                    } catch (Exception ignored) {}

                    // 2. Delete referencing stock transactions first
                    try {
                        List<StockTransaction> relatedTransactions = stockTransactionRepository.findByProductIdOrderByCreatedAtDesc(p.getId());
                        if (!relatedTransactions.isEmpty()) {
                            stockTransactionRepository.deleteAll(relatedTransactions);
                        }
                    } catch (Exception ignored) {}

                    // 3. Now delete product safely
                    productRepository.delete(p);
                }
            }
        } catch (Exception e) {
            System.err.println("⚠️ Note during cleanup: " + e.getMessage());
        }
    }

    private void seedRealFashionCatalog(User admin, User manager, User staff) {
        List<FashionProduct> createdProducts = new ArrayList<>();

        // 1. Italian Wool Slim-Fit Tuxedo Blazer
        FashionProduct blazer = createFashionProduct(
                "Italian Wool Slim-Fit Tuxedo Blazer",
                "BLAZER-WOOL-001",
                "Single-breasted luxury evening tuxedo blazer tailored from Super 120s Italian Merino wool with satin shawl lapels.",
                FashionProduct.Category.CLOTHING_MENS,
                "Raymond Made-to-Measure",
                new BigDecimal("14999.00"),
                FashionProduct.Season.ALL_SEASON,
                FashionProduct.Gender.MALE,
                "100% Super 120s Italian Merino Wool, Silk Satin Lapels",
                "Specialized dry clean only, store in cedar wardrobe"
        );
        createVariants(blazer, Arrays.asList(
                new VariantData(ProductVariant.Size.S, ProductVariant.Color.BLACK, 15, 5),
                new VariantData(ProductVariant.Size.M, ProductVariant.Color.BLACK, 25, 5),
                new VariantData(ProductVariant.Size.L, ProductVariant.Color.BLACK, 20, 5),
                new VariantData(ProductVariant.Size.XL, ProductVariant.Color.BLACK, 12, 5),
                new VariantData(ProductVariant.Size.M, ProductVariant.Color.NAVY, 18, 5),
                new VariantData(ProductVariant.Size.L, ProductVariant.Color.NAVY, 14, 5),
                new VariantData(ProductVariant.Size.M, ProductVariant.Color.BURGUNDY, 10, 4)
        ));
        createdProducts.add(blazer);

        // 2. Handwoven Mulberry Silk Banarasi Saree
        FashionProduct saree = createFashionProduct(
                "Handwoven Mulberry Silk Banarasi Saree",
                "SAREE-BANARASI-001",
                "Authentic handloom Varanasi Katan silk saree woven with electroplated antique gold zari border and floral jaal motif.",
                FashionProduct.Category.CLOTHING_WOMENS,
                "FabIndia Silk Artisans",
                new BigDecimal("18499.00"),
                FashionProduct.Season.ALL_SEASON,
                FashionProduct.Gender.FEMALE,
                "100% Pure Mulberry Katan Silk with Metallic Zari",
                "Dry clean only, wrap in pure cotton muslin cover"
        );
        createVariants(saree, Arrays.asList(
                new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.BURGUNDY, 12, 3),
                new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.MAROON, 10, 3),
                new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.GOLD, 8, 3),
                new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.TEAL, 6, 3),
                new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.ROSE_GOLD, 5, 3)
        ));
        createdProducts.add(saree);

        // 3. Heavyweight Oversized Acid-Wash Streetwear Hoodie
        FashionProduct hoodie = createFashionProduct(
                "Heavyweight Oversized Acid-Wash Hoodie",
                "HOODIE-STREET-001",
                "Contemporary relaxed drop-shoulder hoodie crafted from 450 GSM organic French terry cotton with subtle distress accents.",
                FashionProduct.Category.CLOTHING_MENS,
                "Zara Studio",
                new BigDecimal("3499.00"),
                FashionProduct.Season.AUTUMN,
                FashionProduct.Gender.UNISEX,
                "100% Organic French Terry Cotton (450 GSM)",
                "Machine wash cold inside out, air dry flat"
        );
        createVariants(hoodie, Arrays.asList(
                new VariantData(ProductVariant.Size.S, ProductVariant.Color.BLACK, 30, 8),
                new VariantData(ProductVariant.Size.M, ProductVariant.Color.BLACK, 45, 10),
                new VariantData(ProductVariant.Size.L, ProductVariant.Color.BLACK, 40, 10),
                new VariantData(ProductVariant.Size.XL, ProductVariant.Color.BLACK, 25, 8),
                new VariantData(ProductVariant.Size.M, ProductVariant.Color.GRAY, 35, 8),
                new VariantData(ProductVariant.Size.L, ProductVariant.Color.GRAY, 30, 8),
                new VariantData(ProductVariant.Size.M, ProductVariant.Color.OLIVE, 20, 5),
                new VariantData(ProductVariant.Size.L, ProductVariant.Color.BEIGE, 22, 5)
        ));
        createdProducts.add(hoodie);

        // 4. Emerald Velvet Backless Evening Gown
        FashionProduct gown = createFashionProduct(
                "Emerald Velvet Backless Evening Gown",
                "GOWN-EVENING-001",
                "Floor-length couture evening gown with an open back, gathered drape waistline, and discreet side slit.",
                FashionProduct.Category.CLOTHING_WOMENS,
                "Glamour Couture Paris",
                new BigDecimal("12999.00"),
                FashionProduct.Season.WINTER,
                FashionProduct.Gender.FEMALE,
                "Stretch Micro-Velvet with Silk Charmeuse Lining",
                "Professional dry clean only"
        );
        createVariants(gown, Arrays.asList(
                new VariantData(ProductVariant.Size.XS, ProductVariant.Color.GREEN, 6, 2),
                new VariantData(ProductVariant.Size.S, ProductVariant.Color.GREEN, 14, 3),
                new VariantData(ProductVariant.Size.M, ProductVariant.Color.GREEN, 16, 3),
                new VariantData(ProductVariant.Size.L, ProductVariant.Color.GREEN, 10, 3),
                new VariantData(ProductVariant.Size.S, ProductVariant.Color.BURGUNDY, 12, 3),
                new VariantData(ProductVariant.Size.M, ProductVariant.Color.BURGUNDY, 15, 3),
                new VariantData(ProductVariant.Size.M, ProductVariant.Color.BLACK, 18, 4)
        ));
        createdProducts.add(gown);

        // 5. 1953 Vintage Selvedge Raw Denim Jeans
        FashionProduct jeans = createFashionProduct(
                "1953 Vintage Selvedge Raw Denim Jeans",
                "JEANS-SELVEDGE-001",
                "Authentic 14.5oz shuttle-loom red-line Japanese raw denim jeans designed with copper rivets and classic button fly.",
                FashionProduct.Category.CLOTHING_MENS,
                "Levi's Premium",
                new BigDecimal("5999.00"),
                FashionProduct.Season.ALL_SEASON,
                FashionProduct.Gender.UNISEX,
                "14.5oz Japanese Kurabo Red-Line Selvedge Denim",
                "Wear raw for 6 months, cold soak and hang dry"
        );
        createVariants(jeans, Arrays.asList(
                new VariantData(ProductVariant.Size.S, ProductVariant.Color.BLUE, 20, 5),
                new VariantData(ProductVariant.Size.M, ProductVariant.Color.BLUE, 35, 8),
                new VariantData(ProductVariant.Size.L, ProductVariant.Color.BLUE, 40, 8),
                new VariantData(ProductVariant.Size.XL, ProductVariant.Color.BLUE, 25, 5),
                new VariantData(ProductVariant.Size.M, ProductVariant.Color.BLACK, 30, 6),
                new VariantData(ProductVariant.Size.L, ProductVariant.Color.BLACK, 28, 6)
        ));
        createdProducts.add(jeans);

        // 6. Air Retro High-Top Court Sneakers
        FashionProduct sneakers = createFashionProduct(
                "Air Retro High-Top Court Sneakers",
                "SNEAKER-AIR-001",
                "Iconic basketball high-top sneakers with tumbled calfskin leather overlays and encapsulated air-sole cushioning.",
                FashionProduct.Category.FOOTWEAR_MENS,
                "Nike Air Atelier",
                new BigDecimal("9999.00"),
                FashionProduct.Season.ALL_SEASON,
                FashionProduct.Gender.UNISEX,
                "Full-Grain Tumbled Leather, Polyurethane Air-Sole",
                "Wipe clean with premium sneaker cleaner"
        );
        createVariants(sneakers, Arrays.asList(
                new VariantData(ProductVariant.Size.SIZE_7, ProductVariant.Color.WHITE, 10, 3),
                new VariantData(ProductVariant.Size.SIZE_8, ProductVariant.Color.WHITE, 18, 4),
                new VariantData(ProductVariant.Size.SIZE_9, ProductVariant.Color.WHITE, 25, 5),
                new VariantData(ProductVariant.Size.SIZE_10, ProductVariant.Color.WHITE, 22, 5),
                new VariantData(ProductVariant.Size.SIZE_11, ProductVariant.Color.WHITE, 15, 3),
                new VariantData(ProductVariant.Size.SIZE_9, ProductVariant.Color.BLACK, 20, 4),
                new VariantData(ProductVariant.Size.SIZE_10, ProductVariant.Color.BLACK, 18, 4),
                new VariantData(ProductVariant.Size.SIZE_9, ProductVariant.Color.RED, 14, 3)
        ));
        createdProducts.add(sneakers);

        // 7. Handcrafted Goodyear-Welted Oxford Shoes
        FashionProduct oxfordShoes = createFashionProduct(
                "Handcrafted Goodyear-Welted Oxford Shoes",
                "SHOES-OXFORD-001",
                "Formal closed-lacing dress shoes handmade with Goodyear welt construction and hand-burnished toe caps.",
                FashionProduct.Category.FOOTWEAR_MENS,
                "Clarks Craftmaster",
                new BigDecimal("8499.00"),
                FashionProduct.Season.ALL_SEASON,
                FashionProduct.Gender.MALE,
                "Full-Grain Italian Calfskin Leather, Oak Bark Sole",
                "Buff with natural beeswax shoe polish and buffing cloth"
        );
        createVariants(oxfordShoes, Arrays.asList(
                new VariantData(ProductVariant.Size.SIZE_7, ProductVariant.Color.BROWN, 8, 3),
                new VariantData(ProductVariant.Size.SIZE_8, ProductVariant.Color.BROWN, 15, 3),
                new VariantData(ProductVariant.Size.SIZE_9, ProductVariant.Color.BROWN, 18, 4),
                new VariantData(ProductVariant.Size.SIZE_10, ProductVariant.Color.BROWN, 12, 3),
                new VariantData(ProductVariant.Size.SIZE_8, ProductVariant.Color.BLACK, 14, 3),
                new VariantData(ProductVariant.Size.SIZE_9, ProductVariant.Color.BLACK, 16, 4)
        ));
        createdProducts.add(oxfordShoes);

        // 8. Italian Nappa Leather Stiletto Pumps
        FashionProduct pumps = createFashionProduct(
                "Italian Nappa Leather Stiletto Pumps",
                "SHOES-PUMPS-001",
                "Sculpted pointed-toe stiletto pumps built with butter-soft Italian nappa leather and memory foam arch support.",
                FashionProduct.Category.FOOTWEAR_WOMENS,
                "Jimmy Choo Atelier",
                new BigDecimal("16999.00"),
                FashionProduct.Season.ALL_SEASON,
                FashionProduct.Gender.FEMALE,
                "Buttery Italian Nappa Leather, 85mm Lacquered Heel",
                "Wipe with microfiber cloth and store in dust pouch"
        );
        createVariants(pumps, Arrays.asList(
                new VariantData(ProductVariant.Size.SIZE_5, ProductVariant.Color.BLACK, 6, 2),
                new VariantData(ProductVariant.Size.SIZE_6, ProductVariant.Color.BLACK, 12, 3),
                new VariantData(ProductVariant.Size.SIZE_7, ProductVariant.Color.BLACK, 15, 3),
                new VariantData(ProductVariant.Size.SIZE_8, ProductVariant.Color.BLACK, 10, 3),
                new VariantData(ProductVariant.Size.SIZE_6, ProductVariant.Color.BEIGE, 8, 2),
                new VariantData(ProductVariant.Size.SIZE_7, ProductVariant.Color.BEIGE, 10, 3),
                new VariantData(ProductVariant.Size.SIZE_7, ProductVariant.Color.RED, 7, 2),
                new VariantData(ProductVariant.Size.SIZE_7, ProductVariant.Color.GOLD, 5, 2)
        ));
        createdProducts.add(pumps);

        // 9. Ribbed Pure Cashmere Turtleneck Sweater
        FashionProduct sweater = createFashionProduct(
                "Ribbed Pure Cashmere Turtleneck Sweater",
                "SWEATER-CASHMERE-001",
                "Luxuriously soft 2-ply knitted turtleneck sweater spun from 100% Inner Mongolian Grade-A cashmere yarns.",
                FashionProduct.Category.CLOTHING_WOMENS,
                "Mango Selected",
                new BigDecimal("7999.00"),
                FashionProduct.Season.WINTER,
                FashionProduct.Gender.FEMALE,
                "100% Grade-A Inner Mongolian Cashmere",
                "Hand wash cold with wool detergent, lay flat to dry"
        );
        createVariants(sweater, Arrays.asList(
                new VariantData(ProductVariant.Size.XS, ProductVariant.Color.CREAM, 8, 3),
                new VariantData(ProductVariant.Size.S, ProductVariant.Color.CREAM, 16, 4),
                new VariantData(ProductVariant.Size.M, ProductVariant.Color.CREAM, 20, 4),
                new VariantData(ProductVariant.Size.L, ProductVariant.Color.CREAM, 12, 3),
                new VariantData(ProductVariant.Size.S, ProductVariant.Color.GRAY, 14, 3),
                new VariantData(ProductVariant.Size.M, ProductVariant.Color.GRAY, 18, 4),
                new VariantData(ProductVariant.Size.M, ProductVariant.Color.BLACK, 15, 3)
        ));
        createdProducts.add(sweater);

        // 10. Monogram Calfskin Crossbody Messenger Bag
        FashionProduct bag = createFashionProduct(
                "Monogram Calfskin Crossbody Messenger Bag",
                "BAG-MESSENGER-001",
                "Structured everyday messenger bag in textured pebbled calfskin with adjustable shoulder strap and 24K gold-plated accents.",
                FashionProduct.Category.ACCESSORIES_BAGS,
                "LuxeStyle Paris",
                new BigDecimal("11499.00"),
                FashionProduct.Season.ALL_SEASON,
                FashionProduct.Gender.UNISEX,
                "Grained Italian Calfskin Leather, 24K Gold Hardware",
                "Clean with delicate leather lotion, avoid water"
        );
        createVariants(bag, Arrays.asList(
                new VariantData(ProductVariant.Size.SMALL, ProductVariant.Color.BLACK, 8, 2),
                new VariantData(ProductVariant.Size.MEDIUM, ProductVariant.Color.BLACK, 15, 3),
                new VariantData(ProductVariant.Size.LARGE, ProductVariant.Color.BLACK, 6, 2),
                new VariantData(ProductVariant.Size.MEDIUM, ProductVariant.Color.BROWN, 12, 3),
                new VariantData(ProductVariant.Size.MEDIUM, ProductVariant.Color.BEIGE, 9, 2)
        ));
        createdProducts.add(bag);

        // 11. Automatic Chronograph Sapphire Timepiece
        FashionProduct watch = createFashionProduct(
                "Automatic Chronograph Sapphire Timepiece",
                "WATCH-AUTO-001",
                "Masterpiece self-winding mechanical watch featuring exhibition caseback, ceramic bezel, and 42-hour power reserve.",
                FashionProduct.Category.ACCESSORIES_WATCHES,
                "Fossil Heritage",
                new BigDecimal("15999.00"),
                FashionProduct.Season.ALL_SEASON,
                FashionProduct.Gender.UNISEX,
                "316L Surgical Stainless Steel, Sapphire Crystal",
                "Water resistant 100m, service mechanism every 3 years"
        );
        createVariants(watch, Arrays.asList(
                new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.SILVER, 14, 3),
                new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.GOLD, 8, 2),
                new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.BLACK, 12, 3),
                new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.ROSE_GOLD, 6, 2)
        ));
        createdProducts.add(watch);

        // 12. Polarized Acetate Aviator Sunglasses
        FashionProduct sunglasses = createFashionProduct(
                "Polarized Acetate Aviator Sunglasses",
                "SUNGLASSES-AVIATOR-001",
                "Modernized pilot aviator sunglasses featuring handcrafted acetate frames and Category 3 polarized UV400 lenses.",
                FashionProduct.Category.ACCESSORIES_SUNGLASSES,
                "Ray-Ban Icons",
                new BigDecimal("6499.00"),
                FashionProduct.Season.SUMMER,
                FashionProduct.Gender.UNISEX,
                "Hand-Polished Italian Acetate, UV400 Mineral Glass",
                "Clean only with optical lens cleaner and microfiber"
        );
        createVariants(sunglasses, Arrays.asList(
                new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.BLACK, 20, 5),
                new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.BROWN, 14, 4),
                new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.GOLD, 10, 3)
        ));
        createdProducts.add(sunglasses);

        // 13. Reversible Full-Grain Italian Leather Belt
        FashionProduct belt = createFashionProduct(
                "Reversible Full-Grain Italian Leather Belt",
                "BELT-REVERSIBLE-001",
                "Dual-sided reversible belt handcrafted from vegetable-tanned Tuscan leather with a swivel brushed metal buckle.",
                FashionProduct.Category.ACCESSORIES_BELTS,
                "Armani Exchange",
                new BigDecimal("2999.00"),
                FashionProduct.Season.ALL_SEASON,
                FashionProduct.Gender.MALE,
                "100% Full-Grain Tuscan Leather, Brushed Nickel Buckle",
                "Wipe clean, nourish with neutral leather balm"
        );
        createVariants(belt, Arrays.asList(
                new VariantData(ProductVariant.Size.SMALL, ProductVariant.Color.BLACK, 18, 4),
                new VariantData(ProductVariant.Size.MEDIUM, ProductVariant.Color.BLACK, 30, 6),
                new VariantData(ProductVariant.Size.LARGE, ProductVariant.Color.BLACK, 22, 5),
                new VariantData(ProductVariant.Size.MEDIUM, ProductVariant.Color.BROWN, 25, 5),
                new VariantData(ProductVariant.Size.LARGE, ProductVariant.Color.BROWN, 16, 4)
        ));
        createdProducts.add(belt);

        // 14. Kids Festive Embroidered Silk Kurta-Pyjama Set
        FashionProduct kidsKurta = createFashionProduct(
                "Kids Festive Embroidered Kurta Set",
                "KIDS-KURTA-001",
                "Traditional festive celebration outfit featuring a mandarin collar kurta with intricate mirror-work and elasticated churidar.",
                FashionProduct.Category.CLOTHING_KIDS,
                "Little Stars Ethnic",
                new BigDecimal("2299.00"),
                FashionProduct.Season.ALL_SEASON,
                FashionProduct.Gender.KIDS,
                "Chanderi Silk Blend with Soft Cotton Voile Lining",
                "Gentle hand wash cold, mild iron"
        );
        createVariants(kidsKurta, Arrays.asList(
                new VariantData(ProductVariant.Size.KIDS_XS, ProductVariant.Color.BLUE, 14, 3),
                new VariantData(ProductVariant.Size.KIDS_S, ProductVariant.Color.BLUE, 20, 4),
                new VariantData(ProductVariant.Size.KIDS_M, ProductVariant.Color.BLUE, 25, 5),
                new VariantData(ProductVariant.Size.KIDS_L, ProductVariant.Color.BLUE, 18, 4),
                new VariantData(ProductVariant.Size.KIDS_M, ProductVariant.Color.YELLOW, 22, 4),
                new VariantData(ProductVariant.Size.KIDS_L, ProductVariant.Color.RED, 15, 3)
        ));
        createdProducts.add(kidsKurta);

        // 15. Limited Edition Runway Trench Coat (With Low Stock & Out of Stock Variants for Live Alerts)
        FashionProduct trenchCoat = createFashionProduct(
                "Limited Edition Runway Trench Coat",
                "COAT-TRENCH-001",
                "Double-breasted weather-resistant cotton gabardine trench coat with storm shield, D-ring belt, and heritage check lining.",
                FashionProduct.Category.CLOTHING_WOMENS,
                "Burberry Heritage Collection",
                new BigDecimal("24999.00"),
                FashionProduct.Season.AUTUMN,
                FashionProduct.Gender.FEMALE,
                "100% Water-Repellent Cotton Gabardine",
                "Specialist dry clean only"
        );
        List<ProductVariant> trenchVariants = createVariants(trenchCoat, Arrays.asList(
                new VariantData(ProductVariant.Size.S, ProductVariant.Color.BEIGE, 2, 5), // Low stock
                new VariantData(ProductVariant.Size.M, ProductVariant.Color.BEIGE, 1, 5), // Critical low stock
                new VariantData(ProductVariant.Size.L, ProductVariant.Color.BEIGE, 0, 5), // Out of stock
                new VariantData(ProductVariant.Size.M, ProductVariant.Color.BLACK, 3, 5)  // Low stock
        ));
        createdProducts.add(trenchCoat);

        // 16. Hand-Embroidered Zardozi Bridal Dupatta (With Out of Stock Alert Variant)
        FashionProduct bridalDupatta = createFashionProduct(
                "Hand-Embroidered Zardozi Bridal Dupatta",
                "DUPATTA-BRIDAL-001",
                "Heirloom bridal veil in gossamer silk organza enriched with real beaten gold wire zardozi embroidery and natural seed pearls.",
                FashionProduct.Category.ACCESSORIES_SCARVES,
                "Sabyasachi Heritage",
                new BigDecimal("21999.00"),
                FashionProduct.Season.WINTER,
                FashionProduct.Gender.FEMALE,
                "100% Silk Organza with Pure Gold Dabka",
                "Heirloom dry clean, store in acid-free tissue paper"
        );
        List<ProductVariant> dupattaVariants = createVariants(bridalDupatta, Arrays.asList(
                new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.RED, 0, 3), // Out of stock
                new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.GOLD, 1, 3), // Low stock
                new VariantData(ProductVariant.Size.ONE_SIZE, ProductVariant.Color.MAROON, 4, 3)
        ));
        createdProducts.add(bridalDupatta);

        // 3. Mirror into Product table for legacy compatibility
        syncToLegacyProducts(createdProducts);

        // 4. Seed Realistic Stock Transactions (Audit Trail)
        seedStockTransactions(createdProducts, trenchVariants, admin, manager, staff);

        // 5. Seed Real Fashion Alerts
        seedFashionAlerts(trenchCoat, trenchVariants, bridalDupatta, dupattaVariants);
    }

    private FashionProduct createFashionProduct(String name, String sku, String description,
                                               FashionProduct.Category category, String brand,
                                               BigDecimal basePrice, FashionProduct.Season season,
                                               FashionProduct.Gender gender, String material,
                                               String careInstructions) {
        FashionProduct product = new FashionProduct();
        product.setName(name);
        product.setSku(sku);
        product.setDescription(description);
        product.setCategory(category);
        product.setBrand(brand);
        product.setBasePrice(basePrice);
        product.setSeason(season);
        product.setTargetGender(gender);
        product.setMaterial(material);
        product.setCareInstructions(careInstructions);

        return fashionProductRepository.save(product);
    }

    private List<ProductVariant> createVariants(FashionProduct product, List<VariantData> variantDataList) {
        List<ProductVariant> savedList = new ArrayList<>();
        for (VariantData data : variantDataList) {
            ProductVariant variant = new ProductVariant();
            variant.setProduct(product);
            variant.setSize(data.size);
            variant.setColor(data.color);
            variant.setQuantity(data.quantity);
            variant.setMinStockLevel(data.minStockLevel);
            variant.setPriceAdjustment(BigDecimal.ZERO);

            savedList.add(productVariantRepository.save(variant));
        }
        return savedList;
    }

    private void syncToLegacyProducts(List<FashionProduct> fashionProducts) {
        for (FashionProduct fp : fashionProducts) {
            Product p = new Product();
            p.setName(fp.getName());
            p.setSku(fp.getSku());
            p.setDescription(fp.getDescription());
            p.setCategory(fp.getCategory() != null ? fp.getCategory().getDisplayName() : "Fashion Retail");
            p.setPrice(fp.getBasePrice());
            p.setQuantity(fp.getTotalStock());
            p.setMinStockLevel(fp.getTotalMinStock());
            productRepository.save(p);
        }
        System.out.println("✅ Synchronized " + fashionProducts.size() + " fashion products to standard products catalog");
    }

    private void seedStockTransactions(List<FashionProduct> products, List<ProductVariant> sampleVariants,
                                      User admin, User manager, User staff) {
        if (stockTransactionRepository.count() > 0) return;

        List<StockTransaction> txList = new ArrayList<>();

        FashionProduct blazer = products.get(0);
        ProductVariant blazerVar = blazer.getVariants().isEmpty() ? null : blazer.getVariants().get(0);
        if (blazerVar != null) {
            StockTransaction tx1 = new StockTransaction(blazer, blazerVar, StockTransaction.TransactionType.STOCK_IN,
                    50, "Autumn/Winter 2026 Collection Initial Inbound Shipment from Milan Hub", admin);
            tx1.setCreatedAt(LocalDateTime.now().minusDays(5));
            txList.add(tx1);

            StockTransaction tx2 = new StockTransaction(blazer, blazerVar, StockTransaction.TransactionType.STOCK_OUT,
                    12, "Flagship Store Customer Orders - Delivery Batch #904", staff);
            tx2.setCreatedAt(LocalDateTime.now().minusDays(3));
            txList.add(tx2);
        }

        FashionProduct hoodie = products.get(2);
        ProductVariant hoodieVar = hoodie.getVariants().isEmpty() ? null : hoodie.getVariants().get(0);
        if (hoodieVar != null) {
            StockTransaction tx3 = new StockTransaction(hoodie, hoodieVar, StockTransaction.TransactionType.STOCK_IN,
                    80, "Factory Direct Replenishment - Streetwear Autumn Batch", manager);
            tx3.setCreatedAt(LocalDateTime.now().minusDays(4));
            txList.add(tx3);

            StockTransaction tx4 = new StockTransaction(hoodie, hoodieVar, StockTransaction.TransactionType.STOCK_OUT,
                    20, "E-Commerce Dispatch Express Delivery #ORD-5541", staff);
            tx4.setCreatedAt(LocalDateTime.now().minusDays(1));
            txList.add(tx4);
        }

        FashionProduct sneakers = products.get(5);
        ProductVariant sneakerVar = sneakers.getVariants().isEmpty() ? null : sneakers.getVariants().get(0);
        if (sneakerVar != null) {
            StockTransaction tx5 = new StockTransaction(sneakers, sneakerVar, StockTransaction.TransactionType.STOCK_IN,
                    35, "Exclusive Release Batch Receipt from Nike Logistics Center", admin);
            tx5.setCreatedAt(LocalDateTime.now().minusDays(2));
            txList.add(tx5);
        }

        stockTransactionRepository.saveAll(txList);
        System.out.println("✅ Seeded " + txList.size() + " realistic stock audit transactions");
    }

    private void seedFashionAlerts(FashionProduct trenchCoat, List<ProductVariant> trenchVariants,
                                  FashionProduct dupatta, List<ProductVariant> dupattaVariants) {
        if (fashionAlertRepository.count() > 0) return;

        // Trench coat low stock alerts
        for (ProductVariant v : trenchVariants) {
            if (v.isOutOfStock()) {
                FashionAlert alert = new FashionAlert(
                        trenchCoat,
                        v,
                        FashionAlert.AlertType.OUT_OF_STOCK,
                        "🚨 " + trenchCoat.getName() + " (" + v.getSizeDisplayName() + "/" + v.getColorDisplayName() + ") is completely OUT OF STOCK! Urgent supplier PO required."
                );
                fashionAlertRepository.save(alert);
            } else if (v.isLowStock()) {
                FashionAlert alert = new FashionAlert(
                        trenchCoat,
                        v,
                        FashionAlert.AlertType.LOW_STOCK,
                        "⚠️ " + trenchCoat.getName() + " (" + v.getSizeDisplayName() + "/" + v.getColorDisplayName() + ") has only " + v.getQuantity() + " units left (Min threshold: " + v.getMinStockLevel() + ")."
                );
                fashionAlertRepository.save(alert);
            }
        }

        // Bridal dupatta alerts
        for (ProductVariant v : dupattaVariants) {
            if (v.isOutOfStock()) {
                FashionAlert alert = new FashionAlert(
                        dupatta,
                        v,
                        FashionAlert.AlertType.OUT_OF_STOCK,
                        "🚨 " + dupatta.getName() + " (" + v.getSizeDisplayName() + "/" + v.getColorDisplayName() + ") is SOLD OUT. Reorder bridal stock immediately."
                );
                fashionAlertRepository.save(alert);
            }
        }

        System.out.println("✅ Seeded real fashion inventory risk sentinel alerts");
    }

    private static class VariantData {
        ProductVariant.Size size;
        ProductVariant.Color color;
        Integer quantity;
        Integer minStockLevel;

        VariantData(ProductVariant.Size size, ProductVariant.Color color, Integer quantity, Integer minStockLevel) {
            this.size = size;
            this.color = color;
            this.quantity = quantity;
            this.minStockLevel = minStockLevel;
        }
    }
}