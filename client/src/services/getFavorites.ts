import axios from 'axios';

export const getFavorites = async () => {
  try {
    const res = await axios.get('http://localhost:8383/favorites/all');
    const data = res.data;

    if (!data.success) {
      return {
        success: false,
        message: data.message
      }
    }

    return data.favorites;
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