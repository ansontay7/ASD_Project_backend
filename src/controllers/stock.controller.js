const db = require("../config/db");  // Assuming this exports the PostgreSQL connection pool

exports.createTransaction = async (req, res) => {
  const { item_id, transaction_type, quantity, reason } = req.body;

  // ✅ TAKE user_id FROM TOKEN
  const user_id = req.user.user_id;

  if (!item_id || !transaction_type || !quantity) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const client = await db.connect();  // Get a client from the pool

  try {
    await client.query('BEGIN'); // Start transaction

    // 1️⃣ Get current stock
    const result = await client.query(
      "SELECT quantity FROM inventory_items WHERE item_id = $1",
      [item_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    const currentQty = result.rows[0].quantity;

    // 2️⃣ Validate IN transaction (Admin only)
    if (transaction_type === "IN" && req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Only Admin can perform stock IN",
      });
    }

    if (transaction_type === "OUT" && quantity > currentQty) {
      return res.status(400).json({
        message: "Insufficient stock",
      });
    }

    // 3️⃣ Calculate new quantity
    const newQty =
      transaction_type === "IN"
        ? currentQty + quantity
        : currentQty - quantity;

    // 4️⃣ Insert transaction
    const insertSql = `
      INSERT INTO stock_transactions
      (item_id, user_id, transaction_type, quantity, reason, transaction_date)
      VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)
      RETURNING transaction_id
    `;

    const insertResult = await client.query(insertSql, [
      item_id,
      user_id,
      transaction_type,
      quantity,
      reason || "No reason provided",
    ]);

    const transaction_id = insertResult.rows[0].transaction_id;

    // 5️⃣ Update inventory quantity
    await client.query(
      "UPDATE inventory_items SET quantity = $1 WHERE item_id = $2",
      [newQty, item_id]
    );

    await client.query('COMMIT'); // Commit transaction

    return res.json({
      message: "Stock transaction successful",
      new_quantity: newQty,
      transaction_id,
    });
  } catch (err) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    client.release(); // Release client back to pool
  }
};

exports.getStockHistory = async (req, res) => {
  try {
    const sql = `
      SELECT 
        st.transaction_id,
        i.item_name,
        st.transaction_type,
        st.quantity,
        st.reason,
        u.name AS performed_by,
        st.created_at
      FROM stock_transactions st
      JOIN inventory_items i ON st.item_id = i.item_id
      JOIN users u ON st.user_id = u.user_id
      ORDER BY st.created_at DESC
    `;

    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    console.error("Stock history error:", err);
    res.status(500).json({ message: "Failed to load stock history" });
  }
};
