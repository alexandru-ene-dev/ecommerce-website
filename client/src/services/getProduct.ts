import api from "../api";
import handleErrors from "../utils/handleErrors";


export const getProduct = async (nameParam: string) => {
  try {
    const res = await api.get(`/products/${nameParam}`);
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
    return {
      success: false,
      message: handleErrors(err)
    }
  }
};