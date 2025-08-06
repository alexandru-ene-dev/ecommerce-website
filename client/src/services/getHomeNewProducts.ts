import axios from 'axios';

export const getHomeNewProducts = async () => {
  try {
    const res = await axios.get('http://localhost:8383');
    const data = res.data;
    const products = data.products;
  
    if (products.length === 0) {
      console.log('no products');
      return { success: false, message: 'No new products' };
    }
  
    return { success: true, products };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        message: err.message
      }
    }

    return {
      success: false,
      message: `Unexpected error: ${err}`
    }
  }
};