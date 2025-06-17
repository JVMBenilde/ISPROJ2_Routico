import { db } from '../db.js';

// Fetch drivers by owner_id
export const getDrivers = async (req, res) => {
  const { ownerId } = req.query;
  try {
    const [drivers] = await db.query(
      'SELECT driver_id, full_name, phone, license_number FROM Drivers WHERE owner_id = ?',
      [ownerId]
    );
    res.json(drivers);
  } catch (err) {
    console.error('Error fetching drivers:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add driver
export const addDriver = async (req, res) => {
  const { ownerId, fullName, phone, licenseNumber } = req.body;
  try {
    await db.query(
      `INSERT INTO Drivers (owner_id, full_name, phone, license_number)
       VALUES (?, ?, ?, ?)`,
      [ownerId, fullName, phone, licenseNumber]
    );
    res.status(201).json({ message: 'Driver added' });
  } catch (err) {
    console.error('Error adding driver:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update driver
export const updateDriver = async (req, res) => {
  const { driverId } = req.params;
  const { fullName, phone, licenseNumber } = req.body;
  try {
    await db.query(
      `UPDATE Drivers SET full_name = ?, phone = ?, license_number = ? WHERE driver_id = ?`,
      [fullName, phone, licenseNumber, driverId]
    );
    res.json({ message: 'Driver updated' });
  } catch (err) {
    console.error('Error updating driver:', err);
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
