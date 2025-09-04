import api from "../api";
import handleErrors from "../utils/handleErrors";


export const uploadAvatar = async (userId: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append('image', file); // 'image' must match multer's field name
  
    const res = await api.post(`/users/${userId}/avatar`, formData);
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
}