# Task Management System - Server

## 📋 Description

Task Management System Server is a backend API built with Node.js, Express.js, and MongoDB. The system provides RESTful APIs for task management.

## 🛠 Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework  
- **TypeScript** - Programming language
- **MongoDB** - NoSQL Database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **Joi** - Data validation
- **Cloudinary** - File upload service

## 🚀 Installation and Setup

### 1. System Requirements

- **Node.js** >= 16.0.0
- **npm**
- **MongoDB** (local or cloud)

### 2. Install Dependencies

```bash
# Navigate to server directory
cd server

# Install packages
npm install
```

### 3. Environment Configuration

Create `.env` file from `example.env`:

```bash
cp example.env .env
```

Update environment variables in `.env` file:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/task-management

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Cloudinary (Optional - for file upload)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 4. Chạy ứng dụng

```bash
# Development mode (với hot reload)
npm run dev

# Production mode
npm run build
npm start

```

## � Scripts có sẵn

| Command | Description |
|---------|-------------|
| `npm run dev` | Run development server with nodemon |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Run production server |

---

📅 **Last Updated**: August 2025
