import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import registerRoute from './routes/registerRoute.js';
import verifyOtpRoute from './routes/verifyOtpRoute.js';
import loginRoute from './routes/loginRoute.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/register', registerRoute);
app.use('/api/verify-otp', verifyOtpRoute);
app.use('/api/login', loginRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));