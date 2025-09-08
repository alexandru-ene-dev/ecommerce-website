import { ProductModel } from '../models/ProductSchema.js';
const fetchProductsController = async (req, res) => {
    try {
        const { subcategory, subSubcategory } = req.params;
        const { sale, subSubcategory: subSub } = req.query;
        console.log('route hit');
        console.log('PARAM:', req.params);
        console.log('QUERY:', req.query);
        if (!subcategory) {
            return res.status(400).json({
                success: false,
                message: 'Missing subcategory from request'
            });
        }
        if (subcategory === 'collections') {
            const products = await ProductModel.find({ collections: { $exists: true } });
            return res.status(200).json({
                success: true,
                message: 'Fetching complete',
                products
            });
        }
        // base MongoDB filter
        const filter = { subcategory };
        if (subSubcategory) {
            filter.subSubcategory = subSubcategory;
        }
        // optional filters from query
        if (sale) {
            filter.sale = { $gte: Number(sale) };
        }
        if (subSub) {
            filter.subSub = subSub;
        }
        const products = await ProductModel.find(filter);
        if (!products.length) {
            return res.status(404).json({
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
