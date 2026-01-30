package com.inventory.config;

import com.inventory.model.User;
import com.inventory.model.Product;
import com.inventory.repository.UserRepository;
import com.inventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Create default admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                "admin",
                "admin@inventra.com",
                passwordEncoder.encode("admin123"),
                User.Role.ADMIN
            );
            admin.setStatus(User.UserStatus.APPROVED);
            
            userRepository.save(admin);
            
            System.out.println("✅ Default Admin User Created Successfully!");
        } else {
            System.out.println("✅ Admin User Already Exists");
        }
        
        // Create sample products if database is empty
        if (productRepository.count() == 0) {
            createSampleProducts();
            System.out.println("✅ Sample Products Created Successfully!");
        } else {
            System.out.println("✅ Products Already Exist in Database");
        }
    }
    
    private void createSampleProducts() {
        // Electronics Category
        Product laptop = new Product();
        laptop.setName("Dell Inspiron 15 Laptop");
        laptop.setDescription("15.6-inch laptop with Intel Core i5, 8GB RAM, 256GB SSD");
        laptop.setCategory("Electronics");
        laptop.setSku("DELL-INS-15-001");
        laptop.setPrice(new BigDecimal("45000.00"));
        laptop.setQuantity(25);
        laptop.setMinStockLevel(5);
        productRepository.save(laptop);
        
        Product smartphone = new Product();
        smartphone.setName("Samsung Galaxy A54");
        smartphone.setDescription("6.4-inch smartphone with 128GB storage, 50MP camera");
        smartphone.setCategory("Electronics");
        smartphone.setSku("SAM-GAL-A54-001");
        smartphone.setPrice(new BigDecimal("28000.00"));
        smartphone.setQuantity(40);
        smartphone.setMinStockLevel(10);
        productRepository.save(smartphone);
        
        Product headphones = new Product();
        headphones.setName("Sony WH-CH720N Headphones");
        headphones.setDescription("Wireless noise-canceling headphones with 35-hour battery");
        headphones.setCategory("Electronics");
        headphones.setSku("SONY-WH-CH720N");
        headphones.setPrice(new BigDecimal("8500.00"));
        headphones.setQuantity(60);
        headphones.setMinStockLevel(15);
        productRepository.save(headphones);
        
        // Office Supplies Category
        Product printer = new Product();
        printer.setName("HP LaserJet Pro M404n");
        printer.setDescription("Monochrome laser printer with network connectivity");
        printer.setCategory("Office Supplies");
        printer.setSku("HP-LJ-M404N-001");
        printer.setPrice(new BigDecimal("15000.00"));
        printer.setQuantity(12);
        printer.setMinStockLevel(3);
        productRepository.save(printer);
        
        Product chair = new Product();
        chair.setName("Ergonomic Office Chair");
        chair.setDescription("Adjustable height office chair with lumbar support");
        chair.setCategory("Office Supplies");
        chair.setSku("ERG-CHAIR-001");
        chair.setPrice(new BigDecimal("12000.00"));
        chair.setQuantity(18);
        chair.setMinStockLevel(5);
        productRepository.save(chair);
        
        Product notebook = new Product();
        notebook.setName("A4 Spiral Notebook Pack");
        notebook.setDescription("Pack of 5 A4 spiral notebooks, 200 pages each");
        notebook.setCategory("Office Supplies");
        notebook.setSku("NB-A4-SPIRAL-5PK");
        notebook.setPrice(new BigDecimal("250.00"));
        notebook.setQuantity(100);
        notebook.setMinStockLevel(20);
        productRepository.save(notebook);
        
        // Furniture Category
        Product desk = new Product();
        desk.setName("Executive Office Desk");
        desk.setDescription("Large wooden office desk with drawers and cable management");
        desk.setCategory("Furniture");
        desk.setSku("EXEC-DESK-001");
        desk.setPrice(new BigDecimal("25000.00"));
        desk.setQuantity(8);
        desk.setMinStockLevel(2);
        productRepository.save(desk);
        
        Product bookshelf = new Product();
        bookshelf.setName("5-Tier Bookshelf");
        bookshelf.setDescription("Wooden bookshelf with 5 adjustable shelves");
        bookshelf.setCategory("Furniture");
        bookshelf.setSku("BOOKSHELF-5T-001");
        bookshelf.setPrice(new BigDecimal("8000.00"));
        bookshelf.setQuantity(15);
        bookshelf.setMinStockLevel(3);
        productRepository.save(bookshelf);
        
        // Stationery Category
        Product penSet = new Product();
        penSet.setName("Premium Pen Set");
        penSet.setDescription("Set of 10 premium ballpoint pens in gift box");
        penSet.setCategory("Stationery");
        penSet.setSku("PEN-SET-PREM-10");
        penSet.setPrice(new BigDecimal("500.00"));
        penSet.setQuantity(75);
        penSet.setMinStockLevel(20);
        productRepository.save(penSet);
        
        Product markers = new Product();
        markers.setName("Whiteboard Marker Set");
        markers.setDescription("Set of 12 colored whiteboard markers with eraser");
        markers.setCategory("Stationery");
        markers.setSku("WB-MARKER-12-SET");
        markers.setPrice(new BigDecimal("300.00"));
        markers.setQuantity(50);
        markers.setMinStockLevel(15);
        productRepository.save(markers);
        
        // Create some low stock and out of stock items for testing alerts
        Product lowStockItem = new Product();
        lowStockItem.setName("Wireless Mouse");
        lowStockItem.setDescription("Ergonomic wireless mouse with USB receiver");
        lowStockItem.setCategory("Electronics");
        lowStockItem.setSku("MOUSE-WIRELESS-001");
        lowStockItem.setPrice(new BigDecimal("1200.00"));
        lowStockItem.setQuantity(3); // Low stock
        lowStockItem.setMinStockLevel(10);
        productRepository.save(lowStockItem);
        
        Product outOfStockItem = new Product();
        outOfStockItem.setName("USB Flash Drive 32GB");
        outOfStockItem.setDescription("High-speed USB 3.0 flash drive, 32GB capacity");
        outOfStockItem.setCategory("Electronics");
        outOfStockItem.setSku("USB-32GB-001");
        outOfStockItem.setPrice(new BigDecimal("800.00"));
        outOfStockItem.setQuantity(0); // Out of stock
        outOfStockItem.setMinStockLevel(5);
        productRepository.save(outOfStockItem);
    }
}
       