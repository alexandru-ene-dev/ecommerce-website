import axios from 'axios';

export const getProduct = async (nameParam: string) => {
  try {
    const res = await axios.get(
      `http://localhost:8383/products/${nameParam}`
    );
    const data = res.data;
    const product = data.product;
    
    if (!product) {
      return {
        success: false,
        message: data.message
      }
    }

    return product;
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