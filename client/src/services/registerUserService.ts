import axios from 'axios';

export type UserDataType = {
  firstName: string, 
  lastName: string, 
  email: string,
  password: string, 
  confirmPass: string,
  acceptTerms: boolean
}

export type ValidationResult = {
  success: boolean,
  message?: string,
  user?: any
};

export const validateInputs = (
  {
    firstName,
    lastName,
    email,
    password,
    confirmPass,
    acceptTerms
  }: UserDataType
): ValidationResult => {
  try {
    if (!firstName || firstName.length < 2) {
      return { success: false, message: 'First name must be at least 2 characters' };
    }

    if (!lastName || lastName.length < 2) {
      return { success: false, message: 'Last name must be at least 2 characters' };
    }

    const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regEx.test(email.trim())) {
      return { success: false, message: 'Invalid email format' };
    }

    if (!password || password.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters long' };
    }

    if (confirmPass !== password) {
      return { success: false, message: 'Passwords do not match' };
    }

    if (!acceptTerms) {
      return { success: false, message: 'Please agree with our terms and conditions before continue' };
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
  {
    firstName,
    lastName,
    email,
    password,
    confirmPass,
    acceptTerms
  }: UserDataType
): Promise<ValidationResult> => {

  const validationResult = validateInputs({
    firstName, 
    lastName, 
    email, 
    password, 
    confirmPass, 
    acceptTerms
  });
  
  if (!validationResult.success) {
    return { success: false, message: validationResult.message };
  }

  // proceed signing up user
  try {
    axios.defaults.withCredentials = true;
    const payload = { firstName, lastName, email, password, confirmPass };
    const res = await axios.post(`http://localhost:8383/api/register`, payload);
    const data = res.data;

    console.log(data);
    return { 
      success: true, 
      message: 'User signed up', 
      user: data.user 
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 409) {
        return { success: false, message: `Conflict error: ${message}`};
      } else if (status === 400) {
        return { success: false, message: `Validation error: ${message}`};
      } else {
        return { success: false, message: `Server error: ${message}`};
      }
    } else {
      return { 
        success: false, 
        message: `Unexpected error: ${(err as Error).message}`
      };
    }
  }
};

export default registerUser;