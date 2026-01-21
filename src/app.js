const express = require('express');
const cors = require('cors');

const inventoryRoutes = require('./routes/inventory.routes');
const stockRoutes = require('./routes/stock.routes');
const authRoutes = require('./routes/auth.routes');
const purchaseRoutes = require('./routes/purchase.routes');
const supplierRoutes = require("./routes/supplier.routes");

const app = express();

/* 🔑 CORS SETUP */
/* Allowed origins */
const allowedOrigins = [
  "http://localhost:5173",
  "https://asd-project-frontend.vercel.app"
];

/* CORS Middleware */
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / curl
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("Not allowed by CORS"), false);
    }
    return callback(null, true);
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

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
