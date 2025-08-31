import axios from 'axios';

const changePasswordService = async (
  userId: string,
  currentPass: string,
  newPass: string,
  confirmPass: string
) => {
  try {
    const payload = { userId, currentPass, newPass, confirmPass };
    const res = await axios.post('http://localhost:8383/account/change-password', payload);
    const data = res.data;
    
    console.log(data);
    if (!data.success) {
      return {
        success: false,
        message: `Couldn\'t update password: ${data.message}`
      }
    }

    return {
      success: true,
      message: data.message
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        message: err?.response?.data.message
      }
    }
    return {
      success: false,
      message: `Unexpected error occurred: ${err}`
    }
  }
};

export { changePasswordService };