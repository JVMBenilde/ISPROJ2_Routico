import { db } from '../db.js';

export const getAssignedOrders = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!userId || role !== 'driver') {
      return res.status(403).json({ error: 'Access denied: driver only' });
    }

    // Get user's full name and phone from Users table
    const [[user]] = await db.query(
      'SELECT full_name, phone FROM Users WHERE user_id = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Try matching full_name + phone in Drivers table
    const [[driver]] = await db.query(
      'SELECT driver_id FROM Drivers WHERE full_name = ? AND phone = ?',
      [user.full_name, user.phone]
    );

    if (!driver) {
      return res.status(404).json({ error: 'Matching driver not found' });
    }

    const driverId = driver.driver_id;

    const [orders] = await db.query(`
      SELECT 
        o.order_id,
        c.company_name,
        c.contact_number AS phone,
        o.pickup_location,
        o.drop_off_location,
        o.weight,
        o.size,
        o.truck_id,
        o.order_status,
        o.scheduled_delivery_time,
        o.order_created_at
      FROM Orders o
      JOIN Customers c ON o.customer_id = c.customer_id
      WHERE o.assigned_driver_id = ?
      ORDER BY o.scheduled_delivery_time ASC
    `, [driverId]);

    res.json(orders);
  } catch (err) {
    console.error('[GET ASSIGNED ORDERS ERROR]', err);
    res.status(500).json({ error: 'Server error retrieving assigned orders' });
  }
};
