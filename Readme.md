# Car Shop API

A comprehensive REST API for a car shop application built with Express.js, TypeScript, and MongoDB.

## Features

- User authentication and authorization with JWT
- Car management (CRUD operations)
- Order processing with payment integration (Shurjopay)
- Error handling and validation
- Role-based access control (admin/user)

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Payment**: Shurjopay integration
- **File Storage**: Cloudinary
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v14 or above)
- MongoDB database

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:

```
# ENV
NODE_ENV=development

# Server Config
PORT=1337

#  DB
DB_URL=mongodb+srv://user:<url>.mongodb.net/<dbname>

# JWT
BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET=secret
JWT_ACCESS_EXPIRES_IN=24h
JWT_REFRESH_SECRET=secret
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Shurjopay config
SP_ENDPOINT=shurjopay_endpoint
SP_USERNAME=shurjopay_username
SP_PASSWORD=shurjopay_password
SP_PREFIX=shurjopay_prefix
SP_RETURN_URL=return_url
```

4. Start the development server:

```bash
npm run start:dev
```

5. Production build:

```bash
npm run build
npm run start:prod
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get access token
- `POST /api/auth/change-password` - Change user password (requires authentication)
- `POST /api/auth/refresh-token` - Refresh access token (requires refresh token)

### Cars

- `POST /api/cars` - Add a new car (admin only)
- `GET /api/cars` - Get all cars
- `GET /api/cars/:id` - Get a car by ID
- `PATCH /api/cars/:id` - Update a car (admin only)
- `DELETE /api/cars/:id` - Delete a car (admin only)

### Orders

- `POST /api/orders` - Create a new order (user only)
- `GET /api/orders/verify` - Verify payment status (user only)
- `GET /api/orders` - Get all orders (admin) or user's orders (user)
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id` - Update order status (admin only)
- `DELETE /api/orders/:id` - Delete an order (admin only)

### Project Structure

```
src/
  app/
    builder/                 # Query builder for MongoDB queries
    config/                  # Application configuration
    errors/                  # Error handling utilities
    interface/               # TypeScript interfaces
    middlewares/             # Express middlewares
    modules/                 # Feature modules (auth, users, cars, orders)
    routes/                  # API routes
    templates/               # HTML templates
    utils/                   # Utility functions
  app.ts                     # Express app setup
  server.ts                  # Server entry point
```

### Deployment

The Application is deployed on Vercel. To deploy the application, follow these steps:

1. Build the project:
   ```bash
   npm run build
   ```
2. Deploy to Vercel:
   ```bash
   vercel
   ```
