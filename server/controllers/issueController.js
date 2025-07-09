import { db } from '../db.js';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadFileToS3 = async (buffer, fileName, mimeType) => {
  const key = `issue_attachments/${Date.now()}-${uuidv4()}-${fileName}`;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    ServerSideEncryption: 'AES256',
  };
  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location;
};

export const getAllIssues = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT i.issue_id, i.order_id, 
              u.full_name AS reporter_name,
              c.category_name AS category, i.description, i.status, i.context
       FROM Issues i
       LEFT JOIN Users u ON i.reported_by = u.user_id
       LEFT JOIN IssuesCategories c ON i.category_id = c.category_id`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching issues:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteIssue = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Issues WHERE issue_id = ?', [id]);
    res.json({ message: 'Issue deleted successfully.' });
  } catch (err) {
    console.error('Error deleting issue:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateIssueStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required.' });
  }

  try {
    await db.query('UPDATE Issues SET status = ? WHERE issue_id = ?', [status, id]);
    res.json({ message: 'Issue status updated successfully.' });
  } catch (err) {
    console.error('Error updating issue:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllIssueCategories = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT category_id, category_name FROM IssuesCategories ORDER BY category_name ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching issue categories:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const reportIssue = async (req, res) => {
  try {
    const { category_id, description, context, order_id } = req.body;

    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized. User ID missing.' });
    }
    const reported_by = req.user.userId;
    const file = req.file;

    if (!category_id || !description || !context) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    if (context === 'delivery' && !order_id) {
      return res.status(400).json({ message: 'Order ID is required for delivery issues.' });
    }

    let proof_attachment = null;
    if (file) {
      proof_attachment = await uploadFileToS3(file.buffer, file.originalname, file.mimetype);
    }

    const query = `INSERT INTO Issues (reported_by, order_id, category_id, context, description, proof_attachment, status, reported_at)
                   VALUES (?, ?, ?, ?, ?, ?, 'open', NOW())`;

    await db.query(query, [
      reported_by,
      order_id || null,
      category_id,
      context,
      description,
      proof_attachment
    ]);

    res.status(201).json({ message: 'Issue reported successfully.' });
  } catch (err) {
    console.error('Error reporting issue:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
