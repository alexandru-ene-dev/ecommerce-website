import api from "../api";
import handleErrors from "../utils/handleErrors";


const syncService = async (syncFavorites: boolean, syncCart: boolean, userId: string) => {
  try {
    const payload: any = { userId };

    if (syncFavorites) {
      payload.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    }

    if (syncCart) {
      payload.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    }

    const res = await api.post('/api/sync', payload);
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
    };

  } catch (err) {
    return {
      success: false,
      message: handleErrors(err)
    }
  }
};

export default syncService;