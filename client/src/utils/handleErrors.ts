import axios from 'axios';

const handleErrors = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data.message || err.message || 'Axios error occurred';
  }

  if (err instanceof Error) {
    return err.message;
  }

  return 'Unknown error occurred';
};

export default handleErrors;