import api from "../api";
import handleErrors from "../utils/handleErrors";


const deleteAccountService = async (userId: string) => {
  try {
    const res = await api.delete(`/users/${userId}`);

    return {
      success: true,
      message: res.data.message,
    };

  } catch (err) {
    return {
      success: false,
      message: handleErrors(err),
    };
  }
};

export default deleteAccountService;
