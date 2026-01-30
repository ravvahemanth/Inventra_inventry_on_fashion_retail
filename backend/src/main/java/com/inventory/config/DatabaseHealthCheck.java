package com.inventory.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;

@Component
public class DatabaseHealthCheck {
    
    @Autowired
    private DataSource dataSource;
    
    @EventListener(ApplicationReadyEvent.class)
    public void checkDatabaseConnection() {
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(5)) {
                System.out.println("🗄️  Database Connection: ✅ HEALTHY");
                System.out.println("📊 Database URL: " + connection.getMetaData().getURL());
            } else {
                System.out.println("🗄️  Database Connection: ❌ UNHEALTHY");
            }
        } catch (Exception e) {
            System.out.println("🗄️  Database Connection: ❌ FAILED - " + e.getMessage());
        }
    }
}