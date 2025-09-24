import api from "../api";
import handleErrors from "../utils/handleErrors";


const getHomeNewProducts = async () => {
  try {
    const res = await api.get('/');
    const data = res.data;
    const products = data.products;
  
    if (products.length === 0) {
      return { 
        success: false,
        message: 'No new products' 
      };
    }
  
    return { 
      success: true, 
      products 
    };
    
  } catch (err) {
    return {
      success: false,
      message: handleErrors(err)
    }
  }
};

export { getHomeNewProducts };