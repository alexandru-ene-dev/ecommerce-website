import { CorsOptions } from "cors";

const allowedOrigins = [
  'http://localhost:5173',
  'https://progressio-ecommerce-website.vercel.app'
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // allow request
    } else {
      callback(new Error('Not allowed by CORS')); // reject
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

export const PORT = process.env.PORT || 5000;