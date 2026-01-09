const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventory.controller');

// CRUD routes
router.get('/inventory/low-stock', controller.getLowStockItems);
router.get('/inventory', controller.getAllItems);
router.get('/inventory/:id', controller.getItemById);
router.post('/inventory', controller.createItem);
router.put('/inventory/:id', controller.updateItem);
router.delete('/inventory/:id', controller.deleteItem);

module.exports = router;
