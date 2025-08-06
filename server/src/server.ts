import express, { urlencoded } from 'express';
import type { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import registerRoute from './routes/registerRoute.js';
import loginRoute from './routes/loginRoute.js';
import profileRoute from './routes/profileRoute.js';
import productsRoute from './routes/productsRoute.js';
import addToFavoritesRoute from './routes/addToFavoritesRoute.js';
import homeRoute from './routes/homeRoute.js';
import Database from './config/database.js';
import { PORT, corsOptions } from './config/config.js';
import loginMiddleware from './middleware/loginMiddleware.js';


dotenv.config();
const app: Application = express();

// middleware
app.use(cors(corsOptions));
app.use(urlencoded({ extended: true }));
app.use(express.json());

// routes
app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);
app.use('/profile', loginMiddleware, profileRoute);
app.use('/products', productsRoute);
app.use('/favorites', addToFavoritesRoute);
app.use('/', homeRoute);
// app.use('/home', homeRoute);
// app.get('*', (req, res) => {
//   return res.status(404).json({
//     success: false, message: 'We couldn\'t find the page you were looking for'
//   });
// });

(async () => {
  try {
    await Database();
    
    app.listen(PORT, () => {
      console.log(`Server listening on PORT: ${PORT}`);
    });
  } catch (err) {
    console.error('App couldn\'t start', err);
    process.exit(1);
  }
})();


