import axios from 'axios';

export const addToCartService = async (isOnCart: boolean, productId: string) => {
  try {
    const payload = { isOnCart, productId };
    const res = await axios.post(`http://localhost:8383/cart`, payload);
    const data = res.data;
    
    if (!data.success) {
      return {
        success: false,
        message: `Couldn\'t add it to cart: ${data.message}`
      }
    }

    return {
      success: true,
      product: data.product
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        message: err.message
      }
    }
    return {
      success: false,
      message: `Unexpected error occurred: ${err}`
    }
  }
};