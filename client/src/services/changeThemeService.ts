import api from '../api';
import handleErrors from '../utils/handleErrors';
import type { Theme } from '../context/types';


const changeThemeService = async (userId: string, theme: Theme) => {
  try {
    const payload = { theme, userId };
    const res = await api.post('/account/theme', payload);
    const data = res.data;
    
    if (!data.success) {
      return {
        success: false,
        message: data.message
      }
    }

    return {
      success: true,
      message: data.message,
    };

  } catch (err) {
    return {
      success: false,
      message: handleErrors(err)
    }
  }
};

export { changeThemeService };