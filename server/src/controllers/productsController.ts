import type { Response, Request } from 'express';
import { ProductModel } from '../models/ProductSchema.js';

export const productsController = async (req: Request, res: Response) => {
  try {
    const nameParam = req.params.name;
    if (!nameParam) {
      return res.status(404).json({
        success: false,
        message: 'Couldn\'t find this product'
      });
    }
  
    const decodedNameQuery = (nameParam as string).replaceAll('-', ' ');
    const product = await ProductModel.findOne({ title: decodedNameQuery });
  
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Couldn\'t find this product'
      });
    }
  
    return res.status(200).json({ success: true, product });
  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      message: `Internal server error: ${err}` 
    });
  }
};
