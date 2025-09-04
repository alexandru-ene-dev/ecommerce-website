// import type { Request, Response } from 'express';
// import { ProductModel } from '../models/ProductSchema.js';
export {};
// const favoriteController = async (req: Request, res: Response) => {
//   try {
//     const productName = req.params.product.replaceAll('-', ' ');
//     if (!productName || productName === null) {
//       return res.status(400).json({
//         success: false,
//         message: 'Name param missing from request'
//       });
//     }
//     const product = await ProductModel.findOne({ title: productName });
//     if (!product || product === null) {
//       return res.status(404).json({
//         success: false,
//         message: 'No product matched'
//       });
//     }
//     return res.status(200).json({ 
//       success: true, 
//       isFavorite: product?.isFavorite 
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: `Internal server error: ${err}`
//     });
//   }
// };
// export { favoriteController };
