const express = require("express");
const router = express.Router();
const controller = require("../controllers/supplier.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// Create supplier
router.post("/suppliers", verifyToken, controller.createSupplier);

// Get all suppliers
router.get("/suppliers", verifyToken, controller.getSuppliers);

// Get supplier by ID
router.get("/suppliers/:id", verifyToken, controller.getSupplierById);

// Update supplier
router.put("/suppliers/:id", verifyToken, controller.updateSupplier);

// Delete supplier
router.delete("/suppliers/:id", verifyToken, controller.deleteSupplier);

module.exports = router;
