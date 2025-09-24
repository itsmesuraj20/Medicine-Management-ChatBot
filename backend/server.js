const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Medicine Management ChatBot API',
    version: '1.0.0',
    status: 'active'
  });
});

// API Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/medicines', require('./src/routes/medicines'));
app.use('/api/billing', require('./src/routes/billing'));
app.use('/api/inventory', require('./src/routes/inventory'));
app.use('/api/customers', require('./src/routes/customers'));
app.use('/api/chatbot', require('./src/routes/chatbot'));

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join_pharmacy', (pharmacyId) => {
    socket.join(pharmacyId);
  });
  
  socket.on('inventory_update', (data) => {
    socket.to(data.pharmacyId).emit('inventory_changed', data);
  });
  
  socket.on('new_order', (data) => {
    socket.to(data.pharmacyId).emit('order_received', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});