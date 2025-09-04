import api from "../api";
import handleErrors from "../utils/handleErrors"; 


const logoutService = async () => {
  try {
    const res = await api.post('/api/auth/logout');
    const data = res.data;

    if (!data.success) {
      return {
        success: false,
        message: `Couldn't log out: ${data.message}`
      }
    }
    
    return {
      success: true,
      message: 'You have been logged out'
    }
    
  } catch (err) {
    return {
      success: false,
      message: handleErrors(err)
    }
  }
};

export default logoutService;