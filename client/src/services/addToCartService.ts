import axios from 'axios';

const addToCartService = async (userId: string, isOnCart: boolean, productId: string) => {
  try {
    const payload = { isOnCart, productId, userId };
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
      message: data.message,
      product: data.product,
      updatedCart: data.cart
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        message: `Axios error: ${err.message}`
      }
    }
    return {
      success: false,
      message: `Unexpected error occurred: ${err}`
    }
  }
};

export { addToCartService };