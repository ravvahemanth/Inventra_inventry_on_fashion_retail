# Inventra - Intelligent Inventory Management System

A comprehensive full-stack inventory management system built with Spring Boot and React, designed for fashion retail businesses.

## 🚀 Features
##demo video --https://drive.google.com/drive/folders/1Ak51j0V8khUL8yzsVK9SpxzvISoLPK7r?usp=sharing
### 👑 Admin Features
- **User Management**: Create, approve, reject, and delete users
- **Product Management**: Full CRUD operations for fashion products
- **Inventory Control**: Complete access to all inventory data
- **Reports & Analytics**: Comprehensive reporting system
- **System Settings**: Configure system-wide settings

### 👔 Manager Features  
- **Inventory Viewing**: Access to all inventory data
- **Stock Approval**: Approve stock update requests
- **Reports Access**: View inventory and transaction reports
- **Staff Monitoring**: Monitor staff activities and performance
- **Alert Management**: View and resolve inventory alerts

### 👨‍💻 Staff Features
- **Stock Management**: Add stock entries (stock in/out)
- **Product Updates**: Update product quantities
- **Assigned Inventory**: View only assigned inventory sections
- **Basic Operations**: Core inventory management tasks

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.1
- **Security**: Spring Security with JWT Authentication
- **Database**: MySQL 8.0+ with JPA/Hibernate
- **Build Tool**: Maven 3.6+
- **Java Version**: 17+

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18
- **HTTP Client**: Axios 1.13.2
- **Routing**: React Router DOM 7.12.0
- **Icons**: Lucide React 0.562.0

## 📋 Prerequisites

- Java 17 or higher
- Node.js 18+ and npm
- MySQL 8.0+
- Maven 3.6+

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/ravvahemanth/inventra_-infy-internship.git
cd inventra_-infy-internship
```

### 2. Database Setup
```sql
CREATE DATABASE fashion_retail_db;
```

### 3. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The backend will start on `http://localhost:8888`

### 4. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`

## 🔐 Default Credentials

### Admin Account
- **Email**: admin@inventra.com
- **Password**: admin123

### Manager Account  
- **Email**: manager@inventra.com
- **Password**: manager123

### Staff Account
- **Email**: staff@inventra.com  
- **Password**: staff123

## 📊 Database Configuration

Update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/fashion_retail_db
spring.datasource.username=root
spring.datasource.password=your_password
```

## 🏗️ Project Structure

```
inventra/
├── backend/                 # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/inventory/
│   │       ├── config/      # Configuration classes
│   │       ├── controller/  # REST Controllers
│   │       ├── dto/         # Data Transfer Objects
│   │       ├── model/       # JPA Entities
│   │       ├── repository/  # Data Repositories
│   │       ├── security/    # Security Configuration
│   │       └── service/     # Business Logic
│   └── src/main/resources/
│       └── application.properties
├── Frontend/                # React Frontend
│   ├── src/
│   │   ├── api/            # API Configuration
│   │   ├── components/     # Reusable Components
│   │   ├── context/        # React Context
│   │   ├── pages/          # Page Components
│   │   ├── services/       # API Services
│   │   └── utils/          # Utility Functions
│   └── package.json
└── README.md
```

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Products (Fashion)
- `GET /api/fashion-products` - Get all products
- `POST /api/fashion-products` - Create product (Admin only)
- `PUT /api/fashion-products/{id}` - Update product (Admin only)
- `DELETE /api/fashion-products/{id}` - Delete product (Admin only)

### Stock Transactions
- `GET /api/stock-transactions` - Get transactions (Admin/Manager)
- `POST /api/stock-transactions` - Create transaction (All roles)

### Alerts
- `GET /api/alerts/active` - Get active alerts (Admin/Manager)
- `PUT /api/alerts/{id}/resolve` - Resolve alert (Admin/Manager)

### Admin
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/{id}/status` - Approve/reject user
- `DELETE /api/admin/users/{id}` - Delete user

## 🎨 Key Features

### Fashion Product Management
- **Categories**: Men's/Women's/Kids' Clothing, Footwear, Accessories
- **Variants**: Size and color combinations with individual stock tracking
- **Seasons**: Spring, Summer, Autumn, Winter, All-Season
- **Brands**: Multi-brand support with brand-specific filtering

### Inventory Tracking
- **Real-time Stock**: Live inventory updates
- **Low Stock Alerts**: Automatic notifications for low inventory
- **Stock Transactions**: Complete audit trail of all stock movements
- **Variant Management**: Track stock by size/color combinations

### User Management
- **Role-based Access**: Three-tier permission system
- **Approval Workflow**: Manager registration requires admin approval
- **User Status**: Pending, Approved, Rejected status tracking

### Alert System
- **Smart Notifications**: Automatic low stock and out-of-stock alerts
- **Fashion-specific**: Variant-level alerts for size/color combinations
- **Alert Management**: Mark as resolved, bulk operations

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Authorization**: Method-level security
- **Password Encryption**: BCrypt hashing
- **CORS Configuration**: Configurable cross-origin requests
- **Input Validation**: Comprehensive validation with error handling

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd Frontend
npm test
```

## 📦 Deployment

### Backend (Production)
```bash
cd backend
mvn clean package -Dmaven.test.skip=true
java -jar target/inventory-backend-1.0.0.jar
```

### Frontend (Production)
```bash
cd Frontend
npm run build
# Deploy the dist/ folder to your web server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Hemanth Ravva
- **Organization**: Infosys Internship Program
- **Project Type**: Full-Stack Inventory Management System

## 📞 Support

For support and questions:
- **Email**: inventrainfosys@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/ravvahemanth/inventra_-infy-internship/issues)

## 🎯 Future Enhancements

- [ ] Mobile application (React Native)
- [ ] Advanced analytics dashboard
- [ ] Barcode scanning integration
- [ ] Multi-warehouse support
- [ ] Supplier management
- [ ] Purchase order system
- [ ] Integration with e-commerce platforms

---

**Built with ❤️ for efficient inventory management**
