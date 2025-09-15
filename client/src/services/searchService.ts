import api from "../api";
import handleErrors from "../utils/handleErrors";


const searchService = async (searchTerm: string) => {
  try {
    const res = await api.get(`/products/search?q=${searchTerm}`);
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
      results: data.results
    };

  } catch (err) {
    return {
      success: false,
      message: handleErrors(err)
    }
  }
};

export { searchService };