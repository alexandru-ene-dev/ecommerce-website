import api from '../api';
import handleErrors from '../utils/handleErrors';
import { type UserType } from '../context/AuthContext/authTypes';


type Response = 
| { success: true, message: string, user: UserType } 
| { success: false, message: string, user?: UserType }


const loginUserService = async (
  email: string,
  password: string,
  keepMeLogged: boolean
): Promise<Response> => {
  try {
    const payload = { email, password, keepMeLogged };
    const res = await api.post('/api/login', payload);
    const user = res.data.user;

    if (res.data.success === false) {
      console.log(res.data.message);
      return {
        success: false,
        message: res.data.message
      }
    }

    return {
      success: true,
      message: 'Successful login',
      user
    }
    
  } catch (err) {
    return {
      success: false,
      message: handleErrors(err)
    }
  }
};

export default loginUserService;