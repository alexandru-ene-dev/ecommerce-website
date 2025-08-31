import express, { urlencoded } from 'express';
import type { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoute from './routes/authRoute.js';
import registerRoute from './routes/registerRoute.js';
import loginRoute from './routes/loginRoute.js';
import profileRoute from './routes/profileRoute.js';
import productsRoute from './routes/productsRoute.js'
;
import addToFavoritesRoute from './routes/addToFavoritesRoute.js';
import homeRoute from './routes/homeRoute.js';
import fetchProductsRoute from './routes/fetchProductsRoute.js';
import Database from './config/database.js';
import { PORT, corsOptions } from './config/config.js';

import loginMiddleware from './middleware/loginMiddleware.js';
import logoutRoute from './routes/logoutRoute.js';
import addToCartRoute from './routes/addToCartRoute.js';
import editNameRoute from './routes/editNameRoute.js';
import uploadAvatarRoute from './routes/uploadAvatarRoute.js';

import changePasswordRoute from './routes/changePasswordRoute.js';


dotenv.config();
const app: Application = express();


// middleware
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(urlencoded({ extended: true }));
app.use(express.json());


// routes
app.use('/users', uploadAvatarRoute);
app.use('/editName', editNameRoute);
app.use('/profile', loginMiddleware, profileRoute);
app.use('/api/auth/me', loginMiddleware, authRoute);
app.use('/api/auth/logout', logoutRoute);

app.use('/api/categories', fetchProductsRoute);
app.use('/cart', addToCartRoute);
app.use('/', homeRoute);
app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);

app.use('/products', productsRoute);
app.use('/favorites', addToFavoritesRoute);
app.use('/account/change-password', changePasswordRoute);


// connect to database & run server
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


