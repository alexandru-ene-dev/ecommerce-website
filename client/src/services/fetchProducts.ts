import api from "../api";
import handleErrors from "../utils/handleErrors";


const fetchProducts = async (slug: string) => {
  try {
    const res = await api.get(`/api/categories/${slug}`);
    const data = res.data;

    if (!data.success) {
      return {
        success: false,
        message: `Failed fetching products: ${data.message}`
      }
    }

    if (data.subSubcategories) {
      return {
        success: true,
        message: 'Subcategories fetched',
        subSubcategories: data.subSubcategories
      };
    }

    return {
      success: true,
      message: 'Products fetched',
      products: data.products
    };


  } catch (err) {
    return {
      success: false,
      message: handleErrors(err)
    }
  }
};

export default fetchProducts;