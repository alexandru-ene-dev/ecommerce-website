import api from "../api";
import handleErrors from "../utils/handleErrors";


const addToCartService = async (userId: string, isOnCart: boolean, productId: string) => {
  try {
    const payload = { isOnCart, productId, userId };
    const res = await api.post('/cart', payload);
    const data = res.data;
    
    if (!data.success) {
      return {
        success: false,
        message: data.message
      }
    }

    return {
      success: true,
      message: data.message,
      product: data.product,
      updatedCart: data.cart
    };

  } catch (err) {
    return {
      success: false,
      message: handleErrors(err)
    }
  }
};

export { addToCartService };