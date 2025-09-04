import api from "../api";
import handleErrors from "../utils/handleErrors";


const changePasswordService = async (
  userId: string,
  currentPass: string,
  newPass: string,
  confirmPass: string
) => {
  
  try {
    const payload = { userId, currentPass, newPass, confirmPass };
    const res = await api.post('/account/change-password', payload);
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
    };

  } catch (err) {
    return {
      success: false,
      message: handleErrors(err)
    }
  }
};

export { changePasswordService };