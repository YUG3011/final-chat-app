import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dbConnect from './DB/dbConnect.js';
import authRouter from './route/authUser.js';
import messageRouter from './route/messageRoute.js';
import userRouter from './route/userRoute.js';

dotenv.config(); // Load .env variables

// Import app and server created in Socket.js
import { app, server } from './socket/Socket.js';

//  CORS Middleware - Make sure it matches frontend port exactly
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

//  General Middleware
app.use(express.json());
app.use(cookieParser());

//  API Routes
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);
app.use('/api/user', userRouter);

//  Default health route
app.get('/', (req, res) => {
  res.send('Server is running');
});

//  Start server after DB connection
const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  try {
    await dbConnect();
    console.log(` Server is running at http://localhost:${PORT}`);
  } catch (error) {
    console.error(" Failed to connect to MongoDB:", error);
  }
});
