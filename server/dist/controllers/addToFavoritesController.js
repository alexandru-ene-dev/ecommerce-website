import { ProductModel } from '../models/ProductSchema.js';
const addToFavoritesController = async (req, res) => {
    try {
        const isFavorite = req.body.isFavorite;
        if (isFavorite === null) {
            return res.status(400).json({
                success: false,
                message: 'Client error: isFavorite missing from request body'
            });
        }
        const productName = req.body.product.replaceAll('-', ' ');
        if (!productName || productName === null) {
            return res.status(400).json({
                success: false,
                message: 'Client error: Product name missing from request body'
            });
        }
        const product = await ProductModel.findOne({ title: productName });
        console.log(productName);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'No product matched'
            });
        }
        await product.updateOne({ $set: { isFavorite } });
        return res.status(200).json({
            success: true,
            message: 'Product added to favorites'
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
