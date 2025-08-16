import axios from 'axios';

const fetchProducts = async (slug: string) => {
  try {
    const res = await axios.get(`http://localhost:8383/api/categories/${slug}`);
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
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        message: `Failed fetching products: ${err.message}`
      }
    }

    return {
      success: false,
      message: `Unexpected error occurred: ${err}`
    }
  }
};

export default fetchProducts;