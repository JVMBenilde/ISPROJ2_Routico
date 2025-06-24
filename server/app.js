import express from 'express';
import cors from 'cors';

import loginRoute from './routes/loginRoute.js';
import authRoleRoute from './routes/authRoleRoute.js';
import registerRoute from './routes/sendOtpRoute.js';
import verifyOtpRoute from './routes/verifyOtpRoute.js';
import driverRoute from './routes/driverRoute.js';
import checkEmailRoute from './routes/checkEmailRoute.js';
import businessRoute from './routes/businessRoute.js';
import userRoute from './routes/userRoute.js';
import viewRegistrationsRoute from './routes/viewRegistrationsRoute.js';
import adminRoute from './routes/adminRoute.js';


const app = express();
const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/login', loginRoute);
app.use('/api/auth-role', authRoleRoute);
app.use('/api/send-otp', registerRoute);
app.use('/api/verify-otp', verifyOtpRoute);
app.use('/api/drivers', driverRoute);
app.use('/api/check-email', checkEmailRoute);
app.use('/api/business-owners', businessRoute);
app.use('/api/users', userRoute);
app.use('/api/view-registrations', viewRegistrationsRoute);
app.use('/api/users', adminRoute);

app.listen(PORT, () => {
  console.log(`✅ Backend API server running at http://localhost:${PORT}`);
});
