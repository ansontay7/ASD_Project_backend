const express = require('express');
const cors = require('cors');

const inventoryRoutes = require('./routes/inventory.routes');
const stockRoutes = require('./routes/stock.routes');
const authRoutes = require('./routes/auth.routes');
const purchaseRoutes = require('./routes/purchase.routes');
const supplierRoutes = require("./routes/supplier.routes");

const app = express();

/* 🔑 CORS MUST COME FIRST */
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

/* Parse JSON */
app.use(express.json());

/* Routes */
app.use('/api', inventoryRoutes);
app.use('/api', stockRoutes);
app.use('/api', authRoutes);
app.use('/api', purchaseRoutes);
app.use("/api", supplierRoutes);

app.get('/', (req, res) => {
  res.send('Inventory Management API is running');
});

module.exports = app;
