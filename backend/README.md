# Inventory Management Backend - Spring Boot

A complete Spring Boot backend for inventory management system with MySQL database and JWT authentication.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin/Manager)
  - Manager approval system by Admin
  - Fixed admin credentials

- **Product Management**
  - CRUD operations for products
  - Stock tracking with low stock alerts
  - Category management
  - SKU support with uniqueness validation

- **Transaction Management**
  - Stock in/out transactions
  - Transaction history with pagination
  - Automatic stock updates
  - Transaction statistics

- **Alert System**
  - Automatic low stock alerts
  - Out of stock alerts
  - Alert management (read/unread)

- **Admin Panel**
  - User approval/rejection
  - User management
  - Dashboard statistics

## Technology Stack

- **Framework:** Spring Boot 3.2.1
- **Security:** Spring Security with JWT
- **Database:** MySQL with JPA/Hibernate
- **Build Tool:** Maven
- **Java Version:** 17

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

### 1. Database Setup
Make sure MySQL is running with the credentials in `application.properties`:
- Host: localhost
- Port: 3307
- Database: inventory_db
- Username: root
- Password: omen

Create the database:
```sql
CREATE DATABASE inventory_db;
```

### 2. Build and Run

```bash
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The server will start on port 8080.

### 3. Default Admin Credentials

The application automatically creates a default admin user:
- **Username:** admin
- **Password:** admin123
- **Email:** admin@inventra.com

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new manager (requires admin approval)
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user

### Admin Routes (Admin Only)
- `GET /api/admin/pending-users` - Get pending user approvals
- `PATCH /api/admin/users/{userId}/status` - Approve/reject user
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/{userId}` - Delete user
- `GET /api/admin/stats` - Get dashboard statistics

### Products (Admin/Manager)
- `GET /api/products` - Get all products (with pagination, search, filter)
- `GET /api/products/{id}` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/meta/categories` - Get product categories

### Transactions (Admin/Manager)
- `GET /api/transactions` - Get all transactions (with pagination, filters)
- `POST /api/transactions` - Create new transaction (stock in/out)
- `GET /api/transactions/{id}` - Get single transaction
- `GET /api/transactions/stats/summary` - Get transaction statistics

### Alerts (Admin/Manager)
- `GET /api/alerts` - Get all alerts (with pagination, filters)
- `PATCH /api/alerts/{id}/read` - Mark alert as read
- `PATCH /api/alerts/read-all` - Mark all alerts as read
- `DELETE /api/alerts/{id}` - Delete alert
- `GET /api/alerts/unread/count` - Get unread alerts count
- `POST /api/alerts` - Create manual alert

### Health Check
- `GET /api/health` - Server health status

## Configuration

### Database Configuration
```properties
spring.datasource.url=jdbc:mysql://localhost:3307/inventory_db
spring.datasource.username=root
spring.datasource.password=omen
```

### JWT Configuration
```properties
app.jwt.secret=mySecretKey123456789012345678901234567890
app.jwt.expiration=86400000
```

### CORS Configuration
```properties
app.cors.allowed-origins=http://localhost:5173
```

## Database Schema

The application uses JPA/Hibernate to automatically create the following tables:

### Users Table
- id (Primary Key)
- username (Unique)
- email (Unique)
- password (Encrypted)
- role (ADMIN/MANAGER)
- status (PENDING/APPROVED/REJECTED)
- created_at, updated_at

### Products Table
- id (Primary Key)
- name
- description
- category
- price
- stock_quantity
- min_stock_level
- sku (Unique)
- created_at, updated_at

### Transactions Table
- id (Primary Key)
- product_id (Foreign Key)
- user_id (Foreign Key)
- type (IN/OUT)
- quantity
- notes
- created_at

### Alerts Table
- id (Primary Key)
- product_id (Foreign Key)
- type (LOW_STOCK/OUT_OF_STOCK)
- message
- is_read
- created_at

## Security Features

- **Password Encryption:** BCrypt hashing
- **JWT Authentication:** Secure token-based authentication
- **Role-based Authorization:** Method-level security
- **CORS Configuration:** Configurable cross-origin requests
- **Input Validation:** Bean validation with custom error handling
- **SQL Injection Prevention:** JPA/Hibernate parameterized queries

## Usage Flow

1. **Admin Login:** Use default admin credentials
2. **Manager Registration:** Managers register and wait for admin approval
3. **Admin Approval:** Admin approves/rejects manager accounts
4. **Inventory Management:** Approved users can manage products and transactions
5. **Alert System:** Automatic alerts for low/out of stock items

## Development

### Running in Development Mode
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Building for Production
```bash
mvn clean package -Dmaven.test.skip=true
java -jar target/inventory-backend-1.0.0.jar
```

### Testing
```bash
mvn test
```

## Error Handling

The API includes comprehensive error handling with:
- Appropriate HTTP status codes
- Structured error responses
- Validation error details
- Security exception handling

## Logging

The application uses SLF4J with Logback for logging:
- DEBUG level for application components
- Security events logging
- Database query logging (in development)

## Performance Features

- **Connection Pooling:** HikariCP (default in Spring Boot)
- **Lazy Loading:** JPA lazy loading for relationships
- **Pagination:** All list endpoints support pagination
- **Caching:** Ready for Redis integration
- **Transaction Management:** Declarative transactions