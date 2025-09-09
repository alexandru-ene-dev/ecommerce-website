import api from "../api";
import handleErrors from "../utils/handleErrors";


const initializeAuth = async () => {
  try {
    const res = await api.get('/api/auth/me');
    const user = res.data.user;

    return {
      success: true,
      message: 'You are logged in',
      user
    }

  } catch(err) {
    return {
      success: false,
      message: handleErrors(err)
    }
  }
};

export default initializeAuth;