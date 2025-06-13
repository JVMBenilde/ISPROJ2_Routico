import admin from 'firebase-admin';
import { readFileSync } from 'fs';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    readFileSync('./firebase-adminsdk.json', 'utf8') // 📄 Make sure this file exists!
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;