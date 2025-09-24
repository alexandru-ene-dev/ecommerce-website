import express, { urlencoded } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRoute.js';
import registerRoute from './routes/registerRoute.js';
import loginRoute from './routes/loginRoute.js';
import profileRoute from './routes/profileRoute.js';
import productsRoute from './routes/productsRoute.js';
import favoritesRoute from './routes/favoritesRoute.js';
import homeRoute from './routes/homeRoute.js';
import fetchProductsRoute from './routes/fetchProductsRoute.js';
import Database from './config/database.js';
import { PORT, corsOptions } from './config/config.js';
import loginMiddleware from './middleware/loginMiddleware.js';
import logoutRoute from './routes/logoutRoute.js';
import addToCartRoute from './routes/cartRoute.js';
import editNameRoute from './routes/editNameRoute.js';
import uploadAvatarRoute from './routes/uploadAvatarRoute.js';
import changePasswordRoute from './routes/changePasswordRoute.js';
import changeThemeRoute from './routes/changeThemeRoute.js';
import syncRoute from './routes/syncRoute.js';
import deleteAccountRoute from './routes/deleteAccountRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();
const app = express();
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
app.use('/api/categories', fetchProductsRoute);
app.use('/cart', addToCartRoute);
app.use('/', homeRoute);
app.use('/api/register', registerRoute);
app.use('/api/login', loginRoute);
app.use('/api/auth/logout', logoutRoute);
app.use('/products', productsRoute);
app.use('/favorites', favoritesRoute);
app.use('/account/change-password', changePasswordRoute);
app.use('/account/theme', changeThemeRoute);
app.use('/api/sync', syncRoute);
app.use('/users', deleteAccountRoute);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files from the frontend's dist folder
app.use(express.static(path.resolve(__dirname, '../client/dist')));
// Catch-all route: send index.html for client-side routing (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});
// connect to database & run the server
(async () => {
    try {
        await Database();
        app.listen(PORT, () => {
            console.log(`Server listening on PORT: ${PORT}`);
        });
    }
    catch (err) {
        console.error('App couldn\'t start', err);
        process.exit(1);
    }
})();
