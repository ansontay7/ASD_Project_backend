const express = require('express');
const router = express.Router();
const controller = require('../controllers/purchase.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/purchase-orders', verifyToken, controller.createPO);
router.get('/purchase-orders', verifyToken, controller.getAllPO);
router.get('/purchase-orders/:id', verifyToken, controller.getPODetails);
router.put('/purchase-orders/:id/receive', verifyToken, controller.receivePO);

module.exports = router;
