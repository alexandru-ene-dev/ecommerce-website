import axios from 'axios';

const initializeAuth = async () => {
  try {
    axios.defaults.withCredentials = true;
    const res = await axios.get('http://localhost:8383/api/auth/me');
    const user = res.data.user;

    return {
      success: true,
      message: 'You are already logged in',
      user
    }
  } catch(err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        message: (err as Error).message
      }
    }

    return {
      success: false,
      message: `Unexpected error occurred: ${(err as Error).message}`
    }
  }
};

export default initializeAuth;