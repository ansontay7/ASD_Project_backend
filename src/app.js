const express = require('express');
const cors = require('cors');

const inventoryRoutes = require('./routes/inventory.routes');
const stockRoutes = require('./routes/stock.routes');
const authRoutes = require('./routes/auth.routes');
const purchaseRoutes = require('./routes/purchase.routes');
const supplierRoutes = require("./routes/supplier.routes");

const app = express();

/* 🔑 CORS SETUP */
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://asd-project-frontend.vercel.app" // production frontend
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like Postman)
    if(!origin) return callback(null, true);

    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
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
