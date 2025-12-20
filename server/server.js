const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Servir archivos estáticos desde la raíz

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/void-shop';

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Product Schema
const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Initialize inventory (run once)
async function initializeInventory() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany([
        { productId: 'sweater', name: 'SWEATER', quantity: 1, price: 65 },
        { productId: 'triptych', name: 'TRIPTYCH', quantity: 1, price: 50 }
      ]);
      console.log('✅ Inventory initialized');
    }
  } catch (error) {
    console.error('Error initializing inventory:', error);
  }
}

initializeInventory();

// ==================== API ROUTES ====================

// Get all products inventory
app.get('/api/inventory', async (req, res) => {
  try {
    const products = await Product.find();
    const inventory = {};
    products.forEach(p => {
      inventory[p.productId] = {
        quantity: p.quantity,
        name: p.name,
        price: p.price
      };
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching inventory' });
  }
});

// Get single product
app.get('/api/inventory/:productId', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({
      productId: product.productId,
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      soldOut: product.quantity === 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product' });
  }
});

// Check if product is available
app.get('/api/inventory/:productId/available', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) {
      return res.json({ available: false, soldOut: true });
    }
    res.json({ 
      available: product.quantity > 0,
      soldOut: product.quantity === 0,
      quantity: product.quantity
    });
  } catch (error) {
    res.status(500).json({ error: 'Error checking availability' });
  }
});

// Purchase product (decrement inventory with transaction)
app.post('/api/inventory/:productId/purchase', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const product = await Product.findOne({ productId: req.params.productId }).session(session);
    
    if (!product) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    if (product.quantity <= 0) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, error: 'Product sold out' });
    }
    
    // Decrement quantity
    product.quantity -= 1;
    product.updatedAt = new Date();
    await product.save({ session });
    
    await session.commitTransaction();
    
    res.json({ 
      success: true, 
      newQuantity: product.quantity,
      soldOut: product.quantity === 0,
      message: `${product.name} purchased successfully`
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Transaction error:', error);
    res.status(500).json({ success: false, error: 'Transaction failed' });
  } finally {
    session.endSession();
  }
});

// Reset inventory (admin endpoint)
app.post('/api/inventory/reset', async (req, res) => {
  try {
    await Product.updateMany(
      {},
      { $set: { quantity: 1, updatedAt: new Date() } }
    );
    res.json({ success: true, message: 'Inventory reset to 1 unit each' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error resetting inventory' });
  }
});

// Update product quantity (admin endpoint)
app.put('/api/inventory/:productId', async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }
    
    const product = await Product.findOneAndUpdate(
      { productId: req.params.productId },
      { quantity, updatedAt: new Date() },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ 
      success: true, 
      product: {
        productId: product.productId,
        quantity: product.quantity,
        soldOut: product.quantity === 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 API available at http://localhost:${PORT}/api/inventory`);
});
