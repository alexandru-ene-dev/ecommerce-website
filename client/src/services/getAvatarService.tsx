import api from "../api";
import handleErrors from "../utils/handleErrors";


const getAvatarService = async (userId: string) => {
  try {
    const res = await api.get(`/users/${userId}/avatar`);
    const data = res.data;

    if (data.success === false) {
      return {
        success: false,
        message: data.message
      }
    }

    return {
      success: true,
      message: data.message,
      avatar: data.avatar
    }
  
  } catch (err) {
    return {
      success: false,
      message: handleErrors(err)
    }
  }
};

export { getAvatarService };