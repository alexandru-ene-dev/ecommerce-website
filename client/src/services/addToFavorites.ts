import axios from 'axios';

export const addToFavorites = async (isFavorite: boolean, product: string) => {
  try {
    const payload = { isFavorite, product };
    const res = await axios.post(`http://localhost:8383/favorites`, payload);
    const data = res.data;
    
    if (!data.success) {
      return {
        success: false,
        message: 'Something was wrong on the server'
      }
    }

    return data.isFavorite;
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