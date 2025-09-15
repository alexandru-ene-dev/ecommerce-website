import { ProductModel } from "../models/ProductSchema.js";
import type { Request, Response } from "express";

const searchProductsController = async (req: Request, res: Response) => {
  const rawTerm = req.query.q;

  if (!rawTerm || typeof rawTerm !== 'string') {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing or invalid search query' 
    });
  }

  const searchTerm = rawTerm.toLowerCase();


  try {
    const results = await ProductModel.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { category: searchTerm },
        { subcategory: searchTerm },
        { subSubcategory: searchTerm },
      ]
    });

    if (!results.length) {
      return res.status(404).json({
        success: false,
        message: 'No products found',
      });
    }  

    res.status(200).json({
      success: true,
      message: 'Products found',
      results
    });

  } catch (err) {
    return res.status(404).json({
      success: false,
      message: `Internal server error: ${err}`,
    });
  }
}

export { searchProductsController };
