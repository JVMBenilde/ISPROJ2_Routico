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
import vehicleRoute from './routes/vehicleRoute.js';
import accountRoute from './routes/accountRoute.js';
import issueRoute from './routes/issueRoute.js';
import createOrderRoute from './routes/createOrderRoute.js';
import { getOrderHistory } from './controllers/getOrderHistoryController.js';

// ✅ New unified route for mobile app (driver)
import driverMobileRoute from './routes/driverMobileRoute.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Detailed request logger
app.use((req, res, next) => {
  console.log(`[DEBUG] [${req.method}] ${req.originalUrl}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/login', loginRoute);
app.use('/api/auth-role', authRoleRoute);
app.use('/api/send-otp', registerRoute);
app.use('/api/verify-otp', verifyOtpRoute);
app.use('/api/drivers', driverRoute);
app.use('/api/check-email', checkEmailRoute);
app.use('/api/business-owners', businessRoute); 
app.use('/api/users', userRoute);
app.use('/api/view-registrations', viewRegistrationsRoute);
app.use('/api/vehicles', vehicleRoute);
app.use('/api/accounts', accountRoute);
app.use('/api/issues', issueRoute);
app.use('/api/orders', createOrderRoute);

// ✅ Replace both with unified mobile route handler
app.use('/api/driver', driverMobileRoute);

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ERROR] Unhandled error:', err);
  console.error('[ERROR] Stack trace:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error', 
    detail: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Fallback 404
app.use((req, res) => {
  console.warn(`[WARN] Unmatched route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend API server running at http://localhost:${PORT}`);
});
