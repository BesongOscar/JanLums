const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3015;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'JanLunMS API', version: '1.0.0' });
});

// Mock data
const mockUsers = [
  { id: '1', email: 'admin@pressing237.com', firstName: 'Admin', lastName: 'User', role: 'admin' },
  { id: '2', email: 'counter@pressing237.com', firstName: 'Counter', lastName: 'Staff', role: 'counter_staff' }
];

const mockOrders = [
  { id: 'ORD-001', customer: 'Jean Dupont', status: 'processing', total: 12500, items: 5 },
  { id: 'ORD-002', customer: 'Marie Claire', status: 'ready', total: 8000, items: 3 },
  { id: 'ORD-003', customer: 'Paul Martin', status: 'pending', total: 20000, items: 8 }
];

const mockCustomers = [
  { id: '1', firstName: 'Jean', lastName: 'Dupont', phone: '+237 6XX XXX XXX' },
  { id: '2', firstName: 'Marie', lastName: 'Claire', phone: '+237 6XX XXX XXX' }
];

// Auth routes
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email);
  if (user && password === 'admin123') {
    res.json({ token: 'mock-jwt-token', user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Users routes
app.get('/api/v1/users', (req, res) => {
  res.json(mockUsers);
});

// Orders routes
app.get('/api/v1/orders', (req, res) => {
  res.json(mockOrders);
});

app.get('/api/v1/orders/stats', (req, res) => {
  res.json({
    totalOrders: mockOrders.length,
    pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
    processingOrders: mockOrders.filter(o => o.status === 'processing').length,
    readyOrders: mockOrders.filter(o => o.status === 'ready').length,
    completedOrders: 0
  });
});

// Customers routes
app.get('/api/v1/customers', (req, res) => {
  res.json(mockCustomers);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 JanLunMS API running on: http://localhost:${PORT}`);
  console.log(`📖 API endpoints:`);
  console.log(`   GET  /api/v1/users`);
  console.log(`   GET  /api/v1/orders`);
  console.log(`   GET  /api/v1/customers`);
  console.log(`   POST /api/v1/auth/login`);
});
