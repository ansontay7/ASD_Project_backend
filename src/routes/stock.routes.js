const express = require('express');
const router = express.Router();
const controller = require('../controllers/stock.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/stock/transaction',verifyToken,controller.createTransaction);
router.get("/stock/transaction",verifyToken,controller.getStockHistory);


module.exports = router;
