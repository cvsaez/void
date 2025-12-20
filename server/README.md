# VOID Shop - Backend

Backend API for VOID e-commerce with real-time inventory management.

## Deploy on Render

This backend is configured to run on Render.

## Environment Variables

Set these in Render dashboard:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `PORT`: 3000 (auto-set by Render)

## API Endpoints

- GET `/api/inventory` - Get all products
- GET `/api/inventory/:productId` - Get product details
- POST `/api/inventory/:productId/purchase` - Purchase product
- POST `/api/inventory/reset` - Reset inventory (admin)
