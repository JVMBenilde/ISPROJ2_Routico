import { db } from '../db.js';

export const getOrderById = async (req, res) => {
  try {
    const { order_id } = req.params;
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!userId || role !== 'driver') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // ✅ Get driver_id based on user_id via JOIN
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

    // ✅ Get the order for that driver
    const [[order]] = await db.query(`
      SELECT 
        o.order_id,
        o.pickup_location,
        o.drop_off_location,
        o.order_status,
        o.scheduled_delivery_time,
        o.weight,
        o.size,
        o.truck_id,
        c.company_name,
        c.contact_number AS phone
      FROM Orders o
      JOIN Customers c ON o.customer_id = c.customer_id
      WHERE o.order_id = ? AND o.assigned_driver_id = ?
    `, [order_id, driver.driver_id]);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('[GET ORDER BY ID ERROR]', err);
    res.status(500).json({ error: 'Server error' });
  }
};
