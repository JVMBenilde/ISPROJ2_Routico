import { db } from '../db.js';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';

const storage = multer.memoryStorage();
export const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadFileToS3 = async (buffer, fileName, mimeType) => {
  const key = `registrations/${Date.now()}-${uuidv4()}-${fileName}`;
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

export const submitBusiness = async (req, res) => {
  const { companyName, businessType } = req.body;
  const govIdFile = req.files.find(file => file.fieldname === 'govId');
  const permitFile = req.files.find(file => file.fieldname === 'permit');

  if (!companyName || !businessType || !govIdFile || !permitFile) {
    return res.status(400).json({ error: 'All fields and documents are required.' });
  }

  try {
    const userId = req.user.userId;
    const govIdUrl = await uploadFileToS3(govIdFile.buffer, govIdFile.originalname, govIdFile.mimetype);
    const permitUrl = await uploadFileToS3(permitFile.buffer, permitFile.originalname, permitFile.mimetype);

    const sql = `
      INSERT INTO PendingBusinessRegistrations (
        user_id, company_name, business_type,
        gov_id_url, permit_url, status, submitted_at
      ) VALUES (?, ?, ?, ?, ?, 'pending', NOW())`;
    const values = [userId, companyName, businessType, govIdUrl, permitUrl];

    await db.query(sql, values);
    return res.status(200).json({ message: 'Submitted for review.' });
  } catch (error) {
    console.error('❌ submitBusiness error:', error);
    return res.status(500).json({ error: 'Server error', detail: error.message });
  }
};

export const getMyBusinessRegistration = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [rows] = await db.query(
      `SELECT company_name, business_type, status FROM PendingBusinessRegistrations WHERE user_id = ? ORDER BY submitted_at DESC LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) return res.status(200).json(null);
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error('❌ getMyBusinessRegistration error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [pending] = await db.query(
      `SELECT 
         company_name, 
         business_type, 
         status, 
         submitted_at, 
         reviewed_at, 
         review_notes 
       FROM PendingBusinessRegistrations 
       WHERE user_id = ?`,
      [userId]
    );

    const [approved] = await db.query(
      `SELECT 
         company_name, 
         business_type, 
         'approved' AS status,
         NULL AS submitted_at,
         NULL AS reviewed_at,
         NULL AS review_notes
       FROM BusinessOwners 
       WHERE user_id = ?`,
      [userId]
    );

    const combined = [...pending, ...approved];
    combined.sort((a, b) => new Date(b.submitted_at || 0) - new Date(a.submitted_at || 0));

    res.status(200).json(combined);
  } catch (err) {
    console.error('❌ getMyRegistrations error:', err);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
};
