import api from "../api";
import handleErrors from "../utils/handleErrors";


const clearUserFavorites = async (userId: string) => {
  try {
    const payload = { userId };
    const res = await api.delete('/favorites', { data: payload });
    const data = res.data;
  
    if (!data.success) {
      return {
        success: false,
        message: data.message
      }
    }
  
    return {
      success: true,
      message: data.message
    }

  } catch (err) {
    return {
      success: false,
      message: handleErrors(err)
    }
  }
};

export default clearUserFavorites;