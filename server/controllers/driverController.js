import { db } from '../db.js';

// Fetch drivers for the authenticated business owner
export const getDrivers = async (req, res) => {
  const userId = req.user.userId;

  try {
    const [[owner]] = await db.query(
      'SELECT owner_id FROM BusinessOwners WHERE user_id = ?',
      [userId]
    );

    if (!owner) {
      return res.status(403).json({ message: 'No registered business found.' });
    }

    const [drivers] = await db.query(
      'SELECT driver_id, full_name, phone, license_number FROM Drivers WHERE owner_id = ?',
      [owner.owner_id]
    );

    res.json(drivers);
  } catch (err) {
    console.error('Error fetching drivers:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add driver with validation against Users table and duplicate prevention
export const addDriver = async (req, res) => {
  const { fullName, phone, licenseNumber } = req.body;
  const userId = req.user.userId;

  try {
    const licenseRegex = /^[A-Z0-9]{3}-\d{2}-\d{6}$/;
    if (!licenseRegex.test(licenseNumber)) {
      return res.status(400).json({ message: 'Invalid license number format. Expected format: XXX-XX-XXXXXX (letters/numbers allowed in first segment)' });
    }

    const [[owner]] = await db.query(
      'SELECT owner_id FROM BusinessOwners WHERE user_id = ?',
      [userId]
    );

    if (!owner) {
      return res.status(403).json({ message: 'You must have a registered business to add drivers.' });
    }

    const [matchingUsers] = await db.query(
      `SELECT user_id FROM Users WHERE full_name = ? AND phone = ? AND role = 'driver'`,
      [fullName, phone]
    );

    if (matchingUsers.length === 0) {
      return res.status(404).json({
        message: 'Name and Phone number doesn\'t match any Drivers. Please check if details are correct.'
      });
    }

    const [existingDrivers] = await db.query(
      `SELECT driver_id FROM Drivers 
       WHERE full_name = ? AND phone = ? AND license_number = ? AND owner_id = ?`,
      [fullName, phone, licenseNumber, owner.owner_id]
    );

    if (existingDrivers.length > 0) {
      return res.status(409).json({ message: 'This driver is already added to your business.' });
    }

    await db.query(
      `INSERT INTO Drivers (owner_id, full_name, phone, license_number)
       VALUES (?, ?, ?, ?)`,
      [owner.owner_id, fullName, phone, licenseNumber]
    );

    res.status(201).json({ message: 'Driver added successfully' });
  } catch (err) {
    console.error('Error adding driver:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete driver
export const deleteDriver = async (req, res) => {
  const { driverId } = req.params;
  try {
    await db.query(`DELETE FROM Drivers WHERE driver_id = ?`, [driverId]);
    res.json({ message: 'Driver deleted' });
  } catch (err) {
    console.error('Error deleting driver:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
