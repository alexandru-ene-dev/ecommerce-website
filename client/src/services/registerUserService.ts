import api from "../api";
import handleErrors from "../utils/handleErrors";


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
      return { 
        success: false, 
        message: 'Please agree with our terms and conditions before continue' 
      };
    }
    
    return { success: true };

  } catch (err) {
    return {
      success: false,
      message: handleErrors(err)
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
    const payload = { firstName, lastName, email, password, confirmPass };
    const res = await api.post('/api/register', payload);
    const data = res.data;

    return { 
      success: true, 
      message: 'User signed up', 
      user: data.user 
    };

  } catch (err) {
    return { 
      success: false, 
      message: handleErrors(err)
    };
  }
};

export default registerUser;