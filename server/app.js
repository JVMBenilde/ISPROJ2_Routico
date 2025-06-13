import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import sendOtpRoute from './routes/sendOtpRoute.js';
import verifyOtpRoute from './routes/verifyOtpRoute.js';
import loginRoute from './routes/loginRoute.js';
import authRoleRoute from './routes/authRoleRoute.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/send-otp', sendOtpRoute);
app.use('/api/verify-otp', verifyOtpRoute);
app.use('/api/login', loginRoute);
app.use('/api/auth-role', authRoleRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
