// server/controllers/vehicleController.js
import { db } from '../db.js';

// GET all vehicles for the authenticated business owner
export const getAllVehicles = async (req, res) => {
  const userId = req.user.userId;
  try {
    const [[owner]] = await db.query(
      'SELECT owner_id FROM BusinessOwners WHERE user_id = ?',
      [userId]
    );

    if (!owner) {
      return res.status(403).json({ message: 'No registered business found.' });
    }

    const [vehicles] = await db.query(
      'SELECT truck_id, plate_number, model, capacity, status FROM Trucks WHERE owner_id = ?',
      [owner.owner_id]
    );

    res.json(vehicles);
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST create a new vehicle
export const createVehicle = async (req, res) => {
  const { plateNumber, model, capacity, status } = req.body;
  const userId = req.user.userId;

  try {
    const [[owner]] = await db.query(
      'SELECT owner_id FROM BusinessOwners WHERE user_id = ?',
      [userId]
    );

    if (!owner) {
      return res.status(403).json({ message: 'You must have a registered business to add vehicles.' });
    }

    await db.query(
      `INSERT INTO Trucks (owner_id, plate_number, model, capacity, status)
       VALUES (?, ?, ?, ?, ?)`,
      [owner.owner_id, plateNumber, model, capacity, status]
    );

    res.status(201).json({ message: 'Vehicle added successfully' });
  } catch (err) {
    console.error('Error adding vehicle:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT update an existing vehicle
export const updateVehicle = async (req, res) => {
  const { id: truckId } = req.params;
  const { plateNumber, model, capacity, status } = req.body;
  const userId = req.user.userId;

  try {
    const [[owner]] = await db.query(
      'SELECT owner_id FROM BusinessOwners WHERE user_id = ?',
      [userId]
    );

    if (!owner) {
      return res.status(403).json({ message: 'No registered business found.' });
    }

    const [result] = await db.query(
      `UPDATE Trucks
       SET plate_number = ?, model = ?, capacity = ?, status = ?
       WHERE truck_id = ? AND owner_id = ?`,
      [plateNumber, model, capacity, status, truckId, owner.owner_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Vehicle not found or not authorized.' });
    }

    res.json({ message: 'Vehicle updated successfully' });
  } catch (err) {
    console.error('Error updating vehicle:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE a vehicle
export const deleteVehicle = async (req, res) => {
  const { id: truckId } = req.params;
  try {
    await db.query(`DELETE FROM Trucks WHERE truck_id = ?`, [truckId]);
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    console.error('Error deleting vehicle:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
