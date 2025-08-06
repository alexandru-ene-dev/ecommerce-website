import axios from 'axios';

type Response = {
  success: boolean,
  message: string
  token?: any
}

const loginUserService = async (email: string, password: string): Promise<Response> => {
  try {
    const payload = { email, password };
    const res = await axios.post('http://localhost:8383/api/login', payload);
    const data = res.data;

    return {
      success: true,
      message: 'Successful login',
      token: data.token
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const backendMessage = err.response?.data?.message || 'No response from backend';

      return {
        success: false,
        message: `Login failed: ${backendMessage}`
      }
    }

    return {
      success: false,
      message: 'Login failed: Unexpected error occurred'
    }
  }
};

export default loginUserService;