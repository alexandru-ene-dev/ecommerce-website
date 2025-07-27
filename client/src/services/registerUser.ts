import axios from 'axios';

export type ValidationResult = {
  success: boolean,
  message?: string
};

export const validateInputs = (
  firstName: string, 
  lastName: string, 
  email: string,
  password: string, 
  confirmPass: string
): ValidationResult => {
  try {
    if (!firstName || firstName.length < 2) {
      return { success: false, message: 'First name must be at least 2 characters' };
    }

    if (!lastName || lastName.length < 2) {
      return { success: false, message: 'Last name must be at least 2 characters' };
    }

    const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regEx.test(email.trim()) && typeof email !== 'string') {
      return { success: false, message: 'Invalid email format' };
    }

    if (!password || password.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters long' };
    }

    if (confirmPass !== password) {
      return { success: false, message: 'Password must be at least 8 characters long' };
    }
    
    return { success: true };
  } catch (err) {
    return {
      success: false,
      message: `Unexpected error occurred: ${(err as Error).message}`
    };
  }
}

const registerUser = async (
  firstName: string, 
  lastName: string, 
  email: string,
  password: string, 
  confirmPass: string,
): Promise<ValidationResult> => {

  const validationResult = validateInputs(firstName, lastName, email, password, confirmPass);
  if (validationResult.success) {
    // proceed signing up user
    try {
      const payload = { firstName, lastName, email, password, confirmPass };
      const res = await axios.post(`http://localhost:8383/api/register`, payload);
      const data = res.data;

      console.log(data);
      return { success: true, message: 'User signed up' };
    } catch (err) {
      return {
        success: false,
        message: `Unexpected error occurred: ${(err as Error).message}`
      }
    }
  }

  console.log('Input fields not properly filled');
  return { success: false, message: 'Input fields not properly filled' };
};

export default registerUser;