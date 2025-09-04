import api from "../api";
import handleErrors from "../utils/handleErrors";


const handleRemoveAvatar = async (userId: string) => {
  try {
    const res = await api.delete(`/users/${userId}/avatar`);
    const data = res.data;

    if (data.success === false) {
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

export { handleRemoveAvatar };