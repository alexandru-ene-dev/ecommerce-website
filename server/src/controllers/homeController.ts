import type { Response, Request } from 'express';
import { ProductModel } from '../models/ProductSchema.js';

export const homeController = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find({ showOnHomepage: true }).limit(8);

    if (products.length === 0) {
      return res.status(404).json({
        success: false, 
        message: 'Couldn\'t find any products'
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Welcome Home!',
      products
    });
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      message: 'Couldn\'t GET, internal server error',
    });
  }
};