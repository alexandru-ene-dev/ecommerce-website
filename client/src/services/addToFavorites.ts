import axios from 'axios';

const addToFavorites = async (userId: string, isFavorite: boolean, productId: string) => {
  try {
    const payload = { userId, isFavorite, productId };
    const res = await axios.post(`http://localhost:8383/favorites`, payload);
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

export { addToFavorites };