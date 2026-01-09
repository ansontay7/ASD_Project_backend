const pool = require('../config/db'); // The pool from your db.js file

// Get all inventory items
exports.getAll = async () => {
  const result = await pool.query('SELECT * FROM inventory_items');
  return result.rows;  // PostgreSQL stores results in `rows`
};

// Get item by ID
exports.getById = async (id) => {
  const result = await pool.query('SELECT * FROM inventory_items WHERE item_id = $1', [id]);
  return result.rows;  // The result is an array of objects
};

// Create a new item
exports.create = async (item) => {
  const { item_name, category, quantity, unit_price, reorder_level, supplier_id } = item;
  const result = await pool.query(
    `INSERT INTO inventory_items (item_name, category, quantity, unit_price, reorder_level, supplier_id)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING item_id`, 
    [item_name, category, quantity, unit_price, reorder_level, supplier_id]
  );
  return result.rows[0];  // Returns the inserted row, including the item_id
};

// Update an existing item
exports.update = async (id, item) => {
  const { item_name, category, quantity, unit_price, reorder_level, supplier_id } = item;
  await pool.query(
    `UPDATE inventory_items SET 
      item_name = $1, category = $2, quantity = $3, 
      unit_price = $4, reorder_level = $5, supplier_id = $6
      WHERE item_id = $7`, 
    [item_name, category, quantity, unit_price, reorder_level, supplier_id, id]
  );
};

// Delete an item
exports.delete = async (id) => {
  await pool.query('DELETE FROM inventory_items WHERE item_id = $1', [id]);
};

// Get low stock items (e.g., quantity less than reorder level)
exports.getLowStock = async () => {
  const result = await pool.query(
    'SELECT * FROM inventory_items WHERE quantity < reorder_level'
  );
  return result.rows;  // Returns the rows of low-stock items
};
