import { ProductModel } from '../models/ProductSchema.js';
import UserModel from '../models/UserSchema.js';
export const addToCartController = async (req, res) => {
    try {
        const productId = req.body.productId;
        const userId = req.body.userId;
        const isOnCart = req.body.isOnCart;
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Missing product ID from request'
            });
        }
        const foundProduct = await ProductModel.findOne({ _id: productId });
        if (!foundProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        if (isOnCart === null) {
            return res.status(400).json({
                success: false,
                message: 'Missing isOnCart boolean from request'
            });
        }
        if (isOnCart) {
            // Remove from cart
            user.cart = user.cart.filter(prod => prod._id.toString() !== productId);
        }
        else {
            // Add to cart
            user.cart.push(foundProduct);
        }
        await user.save();
        return res.status(200).json({
            success: true,
            message: isOnCart ? 'Removed from cart' : 'Added to cart',
            product: foundProduct,
            cart: user.cart
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error in updating cart: ${err}`
        });
    }
};
