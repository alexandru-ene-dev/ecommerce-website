import axios from 'axios';

const logoutService = async () => {
  try {
    const res = await axios.post('http://localhost:8383/api/auth/logout');
    const data = res.data;

    if (!data.success) {
      return {
        success: false,
        message: `Couldn't log out: ${data.message}`
      }
    }

    console.log('You have been logged out');
    
    return {
      success: true,
      message: 'You have been logged out'
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        message: `Couldn't log out: ${err.message}`
      }
    }

    return {
      success: false,
      message: `Unexpected error occurred: ${err}`
    }
  }
};

export default logoutService;