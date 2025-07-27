import express from 'express';
import type { Request, Response, Application, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import registerRoute from './routes/registerRoute.js';


dotenv.config();

const app: Application = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/register', registerRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
