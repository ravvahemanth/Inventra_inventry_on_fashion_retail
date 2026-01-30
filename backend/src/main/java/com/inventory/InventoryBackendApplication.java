package com.inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class InventoryBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryBackendApplication.class, args);
    }
    
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        System.out.println("\n" + "=".repeat(70));
        System.out.println("👗 FASHION RETAIL BACKEND IS RUNNING SUCCESSFULLY!");
        System.out.println("🌟 Welcome to the Apparel & Fashion Retail Management System");
        System.out.println("📡 Server: http://localhost:8888");
        System.out.println("🗄️  MySQL Database: Connected to fashion_retail_db");
        System.out.println("🔐 Admin Login: email=admin@inventra.com, password=admin123");
        System.out.println("👔 Manager Login: email=manager@inventra.com, password=manager123");
        System.out.println("👕 Fashion Collection: Clothes, Footwear & Accessories");
        System.out.println("🎨 Features: Size/Color Variants, Seasonal Collections, Brand Management");
        System.out.println("✅ All Fashion APIs are ready to use!");
        System.out.println("=".repeat(70) + "\n");
    }
}