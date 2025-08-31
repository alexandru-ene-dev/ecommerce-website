import { ProductModel } from '../models/ProductSchema.js';
import UserModel from '../models/UserSchema.js';
const addToFavoritesController = async (req, res) => {
    try {
        const isFavorite = req.body.isFavorite;
        const userId = req.body.userId;
        const productId = req.body.productId;
        if (isFavorite === null) {
            return res.status(400).json({
                success: false,
                message: 'Client error: isFavorite missing from request body'
            });
        }
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'No product found'
            });
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found'
            });
        }
        if (isFavorite) {
            // Remove from favorites
            user.favorites = user.favorites.filter(fav => fav._id.toString() !== productId);
        }
        else {
            // Add to favorites
            user.favorites.push(product);
        }
        await user.save();
        return res.status(200).json({
            success: true,
            message: isFavorite ? 'Product removed from favorites' : 'Product added to favorites',
            product,
            favorites: user.favorites
        });
    }
    catch (err) {
        return {
            success: false,
            message: `Internal server error: ${err}`
        };
    }
};
export { addToFavoritesController };
