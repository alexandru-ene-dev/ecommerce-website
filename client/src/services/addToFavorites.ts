import api from '../api';
import handleErrors from '../utils/handleErrors';


const addToFavorites = async (userId: string, isFavorite: boolean, productId: string) => {
  try {
    const payload = { userId, isFavorite, productId };
    const res = await api.post('/favorites', payload);
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
    };

  } catch (err) {
    return {
      success: false,
      message: handleErrors(err)
    }
  }
};

export { addToFavorites };