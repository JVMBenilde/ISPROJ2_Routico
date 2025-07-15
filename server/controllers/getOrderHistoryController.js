import { db } from '../db.js';

export const getOrderHistory = async (req, res) => {
  try {
    const ownerId = req.user?.owner_id;
    if (!ownerId) return res.status(401).json({ error: 'Unauthorized' });

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
        o.assigned_driver_id,
        o.order_status,
        o.scheduled_delivery_time,
        o.order_created_at
      FROM Orders o
      JOIN Customers c ON o.customer_id = c.customer_id
      WHERE o.business_owner_id = ?
      ORDER BY o.order_created_at DESC
    `, [ownerId]);

    res.json(orders);
  } catch (err) {
    console.error('[GET ORDER HISTORY ERROR]', err);
    res.status(500).json({ error: 'Server error retrieving orders' });
  }
};