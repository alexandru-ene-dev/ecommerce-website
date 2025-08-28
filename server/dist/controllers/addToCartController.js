import { ProductModel } from '../models/ProductSchema.js';
export const addToCartController = async (req, res) => {
    try {
        const productId = req.body.productId;
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Missing product from request'
            });
        }
        const foundProduct = await ProductModel.findOne({ _id: productId });
        if (!foundProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        const isOnCart = req.body.isOnCart;
        if (isOnCart === null) {
            return res.status(400).json({
                success: false,
                message: 'Missing isOnCart boolean from request'
            });
        }
        const result = await foundProduct.updateOne({ $set: { isOnCart } });
        console.log(result);
        return res.status(200).json({
            success: true,
            message: 'Cart info successfully updated',
            product: foundProduct
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: `Error updating cart info: ${err}`
        });
    }
};
