import { ProductModel } from '../models/ProductSchema.js';
const fetchProductsController = async (req, res) => {
    try {
        const { subcategory, subSubcategory } = req.params;
        if (!subcategory) {
            return res.status(400).json({
                success: false,
                message: 'Missing subcategory from request'
            });
        }
        if (subSubcategory) {
            const subSubcategories = await ProductModel.find({ subcategory, subSubcategory });
            if (!subSubcategories) {
                return res.status(200).json({
                    success: false,
                    message: 'No products found',
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Fetching complete',
                subSubcategories
            });
        }
        const products = await ProductModel.find({ subcategory });
        if (!products.length) {
            return res.status(200).json({
                success: false,
                message: 'No products found',
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Fetching complete',
            products
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: `Unexpected error occurred during fetching products: ${err}`
        });
    }
};
export { fetchProductsController };
