import pool from '../db.js';

export const createOrder = async (req, res) => {
  console.log('[CREATE ORDER RECEIVED]', req.body);
  try {
    const {
      companyName,
      phone,
      deliveryAddress,
      cargoWeight,
      cargoSizeCategory,
      pickupAddress,
      deliveryDate,
      deliveryTime,
      truckId,
      assignedDriverId,
    } = req.body;

    const businessOwnerId = req.user?.owner_id;

    // Validate required fields
    console.log({
      companyName,
      phone,
      deliveryAddress,
      cargoWeight,
      cargoSizeCategory,
      pickupAddress,
      deliveryDate,
      deliveryTime,
      truckId,
      businessOwnerId,
    });

    if (
      !companyName ||
      !phone ||
      !deliveryAddress ||
      !cargoWeight ||
      !cargoSizeCategory ||
      !pickupAddress ||
      !deliveryDate ||
      !deliveryTime ||
      !truckId ||
      !businessOwnerId
    ) {
      console.error('[CREATE ORDER ERROR] Missing required field(s)');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert new customer
    const [customerResult] = await pool.query(
      `INSERT INTO Customers (company_name, contact_number, address) VALUES (?, ?, ?)`,
      [companyName, phone, deliveryAddress]
    );
    const customerId = customerResult.insertId;

    // Combine date and time into single datetime
    const scheduledTime = `${deliveryDate} ${deliveryTime}`;

    // Insert order with FK references
    const [orderResult] = await pool.query(
      `INSERT INTO Orders 
        (truck_id, business_owner_id, assigned_driver_id, customer_id, weight, size, 
        order_status, pickup_location, drop_off_location, scheduled_delivery_time, 
        order_created_at, order_updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?, NOW(), NOW())`,
      [
        truckId,
        businessOwnerId,
        assignedDriverId || null,
        customerId,
        cargoWeight,
        cargoSizeCategory,
        pickupAddress,
        deliveryAddress,
        scheduledTime,
      ]
    );

    console.log('[ORDER CREATED]', orderResult.insertId);
    res.status(201).json({ message: 'Order created successfully', orderId: orderResult.insertId });
  } catch (err) {
    console.error('[CREATE ORDER ERROR]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
