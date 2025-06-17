import express from 'express';
import cors from 'cors';


import loginRoute from './routes/loginRoute.js';
import authRoleRoute from './routes/authRoleRoute.js';
import registerRoute from './routes/sendOtpRoute.js';
import verifyOtpRoute from './routes/verifyOtpRoute.js';
import driverRoute from './routes/driverRoute.js';
import checkEmailRoute from './routes/checkEmailRoute.js';


const app = express();
const PORT = process.env.PORT || 3001;

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

// ✅ No frontend serving here during development

app.listen(PORT, () => {
  console.log(`✅ Backend API server running at http://localhost:${PORT}`);
});
