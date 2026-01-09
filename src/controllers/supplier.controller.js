const db = require("../config/db");

exports.createSupplier = async (req, res) => {
  try {
    const { supplier_name, contact_person, email, phone } = req.body;

    if (!supplier_name) {
      return res.status(400).json({ message: "Supplier name is required" });
    }

    const sql = `
      INSERT INTO suppliers (supplier_name, contact_person, email, phone)
      VALUES ($1, $2, $3, $4) RETURNING supplier_id
    `;

    const { rows } = await db.query(sql, [
      supplier_name,
      contact_person,
      email,
      phone,
    ]);

    return res.status(201).json({
      message: "Supplier created successfully",
      supplier_id: rows[0].supplier_id, // Access the supplier_id returned by the query
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getSuppliers = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM suppliers");
    res.json(rows); // Return the rows directly (PostgreSQL `rows` is an array)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get supplier by ID
exports.getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await db.query(
      "SELECT * FROM suppliers WHERE supplier_id = $1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json(rows[0]); // Return the first row as supplier
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update supplier
exports.updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { supplier_name, contact_person, email, phone } = req.body;

    if (!supplier_name) {
      return res.status(400).json({ message: "Supplier name is required" });
    }

    await db.query(
      `
      UPDATE suppliers
      SET supplier_name = $1, contact_person = $2, email = $3, phone = $4
      WHERE supplier_id = $5
      `,
      [supplier_name, contact_person, email, phone, id]
    );

    res.json({ message: "Supplier updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM suppliers WHERE supplier_id = $1", [id]);

    res.json({ message: "Supplier deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
