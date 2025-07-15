import { db } from '../db.js';

export const updateOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!userId || role !== 'driver') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get driver_id for this user
    const [[driver]] = await db.query(`
      SELECT d.driver_id
      FROM Drivers d
      JOIN Users u ON d.full_name = u.full_name AND d.phone = u.phone
      WHERE u.user_id = ?
      LIMIT 1
    `, [userId]);

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Update the order status
    const [result] = await db.query(
      `UPDATE Orders SET order_status = ? WHERE order_id = ? AND assigned_driver_id = ?`,
      [status, order_id, driver.driver_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found or not assigned to this driver' });
    }

    // ✅ Log status change
    await db.query(
      `INSERT INTO DeliveryStatusLogs (order_id, status, timestamp) VALUES (?, ?, NOW())`,
      [order_id, status]
    );

    res.json({ message: `Order status updated to "${status}" and logged successfully.` });
  } catch (err) {
    console.error('[UPDATE ORDER STATUS ERROR]', err);
    res.status(500).json({ error: 'Server error' });
  }
};
