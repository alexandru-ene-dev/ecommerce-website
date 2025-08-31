import axios from 'axios';

const getAvatarService = async (userId: string) => {
  try {
    const res = await axios.get(`http://localhost:8383/users/${userId}/avatar`);
    const data = res.data;

    if (data.success === false) {
      return {
        success: false,
        message: data.message || 'Avatar not found'
      }
    }

    return {
      success: true,
      message: data.message || 'something is stinky here',
      avatar: data.avatar
    }
  
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return {
        success: false,
        message: `Request error: ${err.message}`
      }
    }

    return {
      success: false,
      message: `Unexpected error occurred: ${err}`
    }
  }
};

export { getAvatarService };