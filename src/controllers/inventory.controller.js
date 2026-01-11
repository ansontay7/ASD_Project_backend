const Inventory = require('../models/inventory.model');

exports.getAllItems = async (req, res) => {
  try {
    const items = await Inventory.getAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const items = await Inventory.getById(req.params.id);
    if (items.length === 0)
      return res.status(404).json({ message: 'Item not found' });
    res.json(items[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const result = await Inventory.create(req.body);
    res.status(201).json({
      message: 'Item created',
      id: result.item_id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    await Inventory.update(req.params.id, req.body);
    res.json({ message: 'Item updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await Inventory.delete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLowStockItems = async (req, res) => {
  try {
    const results = await Inventory.getLowStock();
    res.json({
      total_low_stock: results.length,
      items: results
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
