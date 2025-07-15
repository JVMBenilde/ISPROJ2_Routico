import { db } from '../db.js';

export const getAllBusinessRegistrations = async (req, res) => {
  try {
    const [pendingAndRejected] = await db.query(`
      SELECT p.id, p.user_id, u.full_name AS owner_name, p.company_name, p.business_type, p.status
      FROM PendingBusinessRegistrations p
      JOIN Users u ON p.user_id = u.user_id
      WHERE p.status IN ('pending', 'rejected')
    `);

    const [approved] = await db.query(`
      SELECT NULL AS id, b.user_id, u.full_name AS owner_name, b.company_name, b.business_type, 'approved' AS status
      FROM BusinessOwners b
      JOIN Users u ON b.user_id = u.user_id
    `);

    const combined = [...pendingAndRejected, ...approved];
    res.json(combined);
  } catch (err) {
    console.error('Error fetching registrations:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const approveBusinessRegistration = async (req, res) => {
  const { id } = req.params;
  const reviewer = req.user.userId;

  try {
    const [[pending]] = await db.query(
      'SELECT * FROM PendingBusinessRegistrations WHERE user_id = ? AND status = ? ORDER BY submitted_at DESC LIMIT 1',
      [id, 'pending']
    );

    if (!pending) {
      return res.status(404).json({ message: 'Pending registration not found' });
    }

    await db.query(
      `INSERT INTO BusinessOwners (user_id, company_name, business_type)
       VALUES (?, ?, ?)`,
      [pending.user_id, pending.company_name, pending.business_type]
    );

    await db.query('DELETE FROM PendingBusinessRegistrations WHERE id = ?', [pending.id]);

    res.status(200).json({ message: 'Approved and removed from pending' });
  } catch (err) {
    console.error('Error approving registration:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const disapproveBusinessRegistration = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const reviewer = req.user.userId;

  console.log('DISAPPROVE CALLED WITH USER_ID:', id, 'REASON:', reason);

  if (!reason) return res.status(400).json({ message: 'Disapproval reason required' });

  try {
    const [[pending]] = await db.query(
      'SELECT * FROM PendingBusinessRegistrations WHERE user_id = ? AND status = ? ORDER BY submitted_at DESC LIMIT 1',
      [id, 'pending']
    );

    if (!pending) {
      return res.status(404).json({ message: 'Pending registration not found' });
    }

    const [result] = await db.query(
      `UPDATE PendingBusinessRegistrations 
       SET status = ?, review_notes = ?, reviewed_at = NOW(), reviewed_by = ? 
       WHERE id = ?`,
      ['rejected', reason, reviewer, pending.id]
    );

    console.log('DB UPDATE RESULT:', result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No registration found or already rejected' });
    }

    res.status(200).json({ message: 'Disapproved' });
  } catch (err) {
    console.error('Error disapproving registration:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
