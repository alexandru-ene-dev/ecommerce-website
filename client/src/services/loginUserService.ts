import axios from 'axios';
import { type UserType } from '../context/AuthContext/authTypes';


type Response = 
| { success: true, message: string, user: UserType } 
| { success: false, message: string, user?: UserType }

const loginUserService = async (email: string, password: string): Promise<Response> => {
  try {
    const payload = { email, password };
    axios.defaults.withCredentials = true;
    const res = await axios.post('http://localhost:8383/api/login', payload);
    const user = res.data.user;

    return {
      success: true,
      message: 'Successful login',
      user
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const message = err.response?.data?.message;

      return {
        success: false,
        message: `Login failed: ${message}`,
      }
    }

    return {
      success: false,
      message: `Login failed, unexpected error occurred: ${(err as Error).message}`
    }
  }
};

export default loginUserService;