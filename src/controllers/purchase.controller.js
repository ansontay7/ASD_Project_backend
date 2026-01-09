const db = require('../config/db');  // Import PostgreSQL connection pool

exports.createPO = async (req, res) => {
  const { supplier_id, items } = req.body;
  const user_id = req.user.user_id;

  if (!supplier_id || !items || items.length === 0) {
    return res.status(400).json({ message: 'Invalid PO data' });
  }

  const client = await db.connect();  // Get a client from the pool

  try {
    await client.query('BEGIN'); // Start transaction

    // Insert the purchase order
    const result = await client.query(
      'INSERT INTO purchase_orders (supplier_id, order_date, created_by) VALUES ($1, CURRENT_DATE, $2) RETURNING po_id',
      [supplier_id, user_id]
    );

    const po_id = result.rows[0].po_id;

    // Prepare the purchase order items
    const values = items.map(item => `(${po_id}, ${item.item_id}, ${item.quantity}, ${item.unit_price})`).join(',');

    // Insert the purchase order items
    await client.query(
      `INSERT INTO purchase_order_items (po_id, item_id, quantity, unit_price) VALUES ${values}`
    );

    await client.query('COMMIT'); // Commit transaction

    res.status(201).json({ message: 'Purchase order created', po_id });

  } catch (err) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    res.status(500).json({ error: err.message });
  } finally {
    client.release(); // Release client back to pool
  }
};

exports.getAllPO = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT po.po_id, s.supplier_name, po.created_at, po.status
       FROM purchase_orders po
       JOIN suppliers s ON po.supplier_id = s.supplier_id`
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPODetails = async (req, res) => {
  const po_id = req.params.id;

  try {
    const result = await db.query(
      `SELECT i.item_name, p.quantity, p.unit_price
       FROM purchase_order_items p
       JOIN inventory_items i ON p.item_id = i.item_id
       WHERE p.po_id = $1`,
      [po_id]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.receivePO = async (req, res) => {
  const poId = req.params.id;
  const client = await db.connect();

  try {
    await client.query('BEGIN'); // Start transaction

    // 1️⃣ Check PO status
    const poResult = await client.query(
      'SELECT status FROM purchase_orders WHERE po_id = $1',
      [poId]
    );

    if (poResult.rows.length === 0) {
      throw new Error('Purchase Order not found');
    }

    if (poResult.rows[0].status === 'RECEIVED') {
      throw new Error('PO already received');
    }

    // 2️⃣ Get PO items
    const itemsResult = await client.query(
      'SELECT item_id, quantity FROM purchase_order_items WHERE po_id = $1',
      [poId]
    );

    // 3️⃣ Update inventory for each item
    for (const item of itemsResult.rows) {
      await client.query(
        'UPDATE inventory_items SET quantity = quantity + $1 WHERE item_id = $2',
        [item.quantity, item.item_id]
      );
    }

    // 4️⃣ Update PO status
    await client.query(
      'UPDATE purchase_orders SET status = $1 WHERE po_id = $2',
      ['RECEIVED', poId]
    );

    await client.query('COMMIT'); // Commit transaction

    res.json({ message: 'Purchase Order received successfully' });

  } catch (err) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    res.status(400).json({ error: err.message });

  } finally {
    client.release(); // Release client back to pool
  }
};
