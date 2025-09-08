import api from "../api";
import handleErrors from "../utils/handleErrors";


const editNameService = async (_id: string, firstName: string, lastName: string) => {
  try {
    const payload = { _id, firstName, lastName };
    const res = await api.put('/editName', payload);
    const data = res.data;

    if (data.success === false) {
      return {
        success: false,
        message: data.message
      }
    }

    return {
      success: true,
      message: data.message,
      data
    }

  } catch (err) {
    return {
      success: false,
      message: handleErrors(err)
    }
  }
}

export default editNameService;