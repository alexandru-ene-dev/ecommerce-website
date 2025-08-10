import { ProductModel } from '../models/ProductSchema.js';
export const getAllFavController = async (req, res) => {
    try {
        const favorites = await ProductModel.find({ isFavorite: true });
        if (!favorites) {
            return res.status(404).json({
                success: false,
                message: 'You didn\'t save any favorites yet'
            });
        }
        return res.status(200).json({
            success: true,
            message: `Favorites: ${favorites.length} products`,
            favorites
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${err}`
        });
    }
};
