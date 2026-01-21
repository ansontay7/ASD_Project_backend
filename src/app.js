const express = require('express');
const cors = require('cors');

const inventoryRoutes = require('./routes/inventory.routes');
const stockRoutes = require('./routes/stock.routes');
const authRoutes = require('./routes/auth.routes');
const purchaseRoutes = require('./routes/purchase.routes');
const supplierRoutes = require("./routes/supplier.routes");

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "https://asd-project-frontend.vercel.app"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle OPTIONS globally
app.options('*', cors());

/* Parse JSON */
app.use(express.json());

/* Routes */
app.use('/api', inventoryRoutes);
app.use('/api', stockRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', purchaseRoutes);
app.use("/api", supplierRoutes);

app.get('/', (req, res) => {
  res.send('Inventory Management API is running');
});

module.exports = app;
