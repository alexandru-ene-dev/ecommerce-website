import axios from 'axios';

const handleRemoveAvatar = async (userId: string) => {
  try {
    const res = await axios.delete(`http://localhost:8383/users/${userId}/avatar`);
    const data = res.data;

    if (data.success === false) {
      console.error(data.message);
      return {
        success: false,
        message: data.message
      }
    }

    console.log(data.message);
    return {
      success: true,
      message: data.message
    }
  } catch (err) {
    console.error("Error removing avatar:", err);
  }
};

export { handleRemoveAvatar };