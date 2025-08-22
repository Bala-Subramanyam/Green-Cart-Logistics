# Green-Cart-Logistics
Delivery Simulation &amp; KPI Dashboard

# Logistics Management System

A comprehensive full-stack web application for managing logistics operations including driver management, order tracking, route optimization, and delivery simulation with performance analytics.

## 🚀 Features

### Core Functionality
- **Driver Management**: CRUD operations for driver profiles with fatigue tracking
- **Order Management**: Create, track, and manage delivery orders
- **Route Management**: Define and manage delivery routes with traffic considerations
- **Simulation Engine**: Intelligent driver allocation with profit optimization
- **Analytics Dashboard**: Real-time performance metrics and visualizations

### Key Capabilities
- **Smart Driver Allocation**: Optimizes order assignment based on driver availability and fatigue
- **Profit Optimization**: Maximizes delivery profits considering bonuses, penalties, and fuel costs
- **Performance Tracking**: Comprehensive KPIs including efficiency scores and on-time delivery rates
- **Real-time Analytics**: Interactive charts and performance breakdowns
- **Responsive Design**: Modern UI that works across all devices

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js** - Server framework
- **MongoDB** with **Mongoose** - Database and ODM
- **JWT** - Authentication and authorization
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** with **TypeScript** - UI framework
- **Vite** - Build tool and development server
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **React Hook Form** + **Zod** - Form handling and validation
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling framework
- **Shadcn/UI** - Component library

## 📁 Project Structure

```
├── backend/
│   ├── controllers/          # Business logic handlers
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoint definitions
│   ├── middleware/          # Authentication middleware
│   └── index.js             # Server entry point
├── frontend/
│   ├── src/
│   │   ├── api/            # API service layer
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # State management
│   │   ├── types/          # TypeScript definitions
│   │   └── routes/         # React Router setup
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd logistics-management-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Create backend environment file** (`.env`)
   ```env
   MONGODB_URI=mongodb://localhost:27017/logistics-db
   ACCESS_SECRET_KEY=your-super-secret-jwt-key-here
   NODE_ENV=development
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   Backend runs on `http://localhost:3000`

3. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## 🔐 Authentication

### Default Login Credentials
- **Username**: `employee1`
- **Password**: `employee1Password`

### Creating New Users
Use the registration endpoint or add users directly to the database:
```javascript
{
  username: "your-username",
  password: "hashed-password"
}
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Drivers
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/:name` - Get driver by name
- `POST /api/drivers/create` - Create new driver
- `PUT /api/drivers/update/:name` - Update driver
- `DELETE /api/drivers/delete/:name` - Delete driver

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:order_id` - Get order by ID
- `POST /api/orders/create` - Create new order
- `PUT /api/orders/update/:order_id` - Update order
- `DELETE /api/orders/delete/:order_id` - Delete order

### Routes
- `GET /api/routes` - Get all routes
- `GET /api/routes/:route_id` - Get route by ID
- `POST /api/routes/create` - Create new route
- `PUT /api/routes/update/:route_id` - Update route
- `DELETE /api/routes/delete/:route_id` - Delete route

### Simulation
- `POST /api/simulation/run` - Run logistics simulation
- `GET /api/simulation/latest` - Get latest simulation results

## 🎯 Simulation Algorithm

The system includes an intelligent simulation engine that:

1. **Driver Selection**: Selects available drivers based on fatigue and work hours
2. **Order Prioritization**: Sorts orders by potential profit (high-value orders first)
3. **Smart Allocation**: Assigns orders to drivers considering:
   - Driver fatigue (30% time penalty if fatigued)
   - Maximum work hours per driver
   - Route complexity and traffic conditions
4. **Profit Calculation**: Computes profits considering:
   - Base order value
   - On-time delivery bonuses (10% for orders > ₹1000)
   - Late delivery penalties (₹50)
   - Fuel costs (traffic-dependent)

### Simulation Parameters
```typescript
{
  number_of_drivers: number,    // How many drivers to use
  route_start_time: string,     // Start time (HH:MM format)
  max_hours_per_driver: number  // Max working hours per driver
}
```

## 📈 Dashboard Analytics

The dashboard provides comprehensive insights:

- **Total Profit**: Real-time profit calculations
- **Efficiency Score**: Percentage of on-time deliveries
- **Delivery Performance**: Pie chart of on-time vs late deliveries
- **Fuel Cost Analysis**: Bar chart breakdown by driver
- **Driver Performance**: Detailed table with individual metrics

## 🎨 UI Components

Built with modern, accessible components:
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode Ready**: CSS custom properties for theme switching
- **Accessible Forms**: Proper labels, validation, and error handling
- **Interactive Charts**: Hover effects and detailed tooltips
- **Loading States**: Smooth loading indicators throughout

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-only Cookies**: Prevents XSS attacks
- **Password Hashing**: bcrypt with salt rounds
- **Route Protection**: Middleware-based route protection
- **CORS Configuration**: Proper cross-origin setup
- **Input Validation**: Zod schemas for type-safe validation

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile-first Approach**: Optimized for small screens
- **Collapsible Sidebar**: Space-efficient navigation
- **Adaptive Tables**: Horizontal scrolling on small screens
- **Touch-friendly**: Proper button sizes and spacing

## 🔧 Development

### Available Scripts

**Backend**:
```bash
npm start          # Start with nodemon (development)
```

**Frontend**:
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Code Structure Guidelines

- **Controllers**: Handle business logic and HTTP responses
- **Models**: Define MongoDB schemas with validation
- **Routes**: Define API endpoints and middleware
- **Components**: Reusable UI components with TypeScript
- **Pages**: Full page components with data fetching
- **API Layer**: Centralized API calls with error handling

 Deployment

can be deployed but since it is a internal feature it is better to integrate into existing one 


Full-Stack Developer passionate to build new things 

-  Specialized in React, Node.js, and MongoDB
-  Focused on creating scalable web applications
-  Experienced in logistics optimization algorithms

Connect with me:
- GitHub: [@yourusername](https://github.com/Bala-Subramanyam)
- LinkedIn: [Your LinkedIn](https://www.linkedin.com/in/subramanyam-eb3eil3)
- Email: gvbalu555@gmail.com

License

This project is licensed under the ISC License. Feel free to use it for learning purposes.

Known Issues & Future Enhancements

Current limitations I'm working on:
- Simulation results storage could benefit from pagination for larger datasets
- Driver fatigue calculation algorithm can be made more sophisticated
- Planning to implement WebSocket for real-time updates
- Considering adding email notifications for delivery updates

Support

If you encounter any issues or have questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed description
3. Feel free to reach out to me directly

Project Goals

I built this system to demonstrate:
- Full-stack development skills
- Complex algorithm implementation
- Modern web development practices
- Clean, maintainable code architecture

---

**Crafted with dedication and attention to detail by Bala Subramanyam**  

