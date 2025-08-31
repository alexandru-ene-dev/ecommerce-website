import axios from 'axios';

export const uploadAvatar = async (userId: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append('image', file); // 'image' must match multer's field name
  
    const res = await axios.post(`http://localhost:8383/users/${userId}/avatar`, formData);
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
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        message: `Request error: ${(err as Error).message}`
      }
    }

    return {
      success: false,
      message: `Unexpected error occurred: ${err}`
    }
  }
}