import { useState, type ChangeEvent } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import axios from 'axios';
import delay from '../utils/delay';
import { useAvatar } from '../context/AuthContext/AvatarContext';

import { uploadAvatar } from '../services/uploadAvatarService';
import { handleRemoveAvatar } from '../services/removeAvatarService';
import { changePasswordService } from '../services/changePasswordService';
import LoadingSpinner from '../components/LoadingSpinner';
import ValidationItem from '../components/ValidationItem';


type Status = {
  status: 'error' | 'success' | null,
  message: string
};

type Field = 'current' | 'new' | 'confirm';


const Profile = () => {
  const { state, dispatch } = useAuthContext();
  const [firstName, setFirstName] = useState<string | ''>('');
  const [lastName, setLastName] = useState<string | ''>('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [ status, setStatus ] = useState<Status>({ status: null, message: ' '});

  const { avatar, setAvatar } = useAvatar();
  const [ isChangingPassword, setIsChangingPassword ] = useState(false);
  const [ currentPassword, setCurrentPassword ] = useState('');
  const [ newPassword, setNewPassword ] = useState('');
  const [ confirmPassword, setConfirmPassword] = useState('');

  const [ isPassVisible, setIsPassVisible ] = useState<Record<Field, boolean>>({
    current: false,
    new: false,
    confirm: false
  });
  const [ isLoading, setLoading ] = useState(false);

  const validations = {
    length: newPassword.length >= 8,
    lowercase: /[a-z]/.test(newPassword),
    uppercase: /[A-Z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*~]/.test(newPassword),
  };

  const isFirstNameValid = /^[a-zA-Z\s]{2,}$/.test(firstName.trim());
  const isLastNameValid = /^[a-zA-Z\s]{2,}$/.test(lastName.trim());
  const isPasswordValid = Object.values(validations).every(Boolean);


  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      alert('No file selected.');
      return;
    }

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };

    reader.readAsDataURL(file);

    try {
      const userId = state.user?._id;
      if (!userId) return;

      await uploadAvatar(userId, file);

      console.log('Avatar uploaded successfully!');
    } catch (err) {
      console.error(err);
    }
  }


  const handleNameEdit = async () => {
    setStatus({ status: null, message: ' ' });
    setLoading(true);
    
    if (!isFirstNameValid || !isLastNameValid) {
      await delay(300);
      setLoading(false);
      setStatus({ 
        status: 'error', 
        message: 'Name must contain at least 2 characters and only letters' 
      });
      
      await delay(2000);
      setStatus({ status: null, message: ' ' });
      return;
    }

    try {
      const payload = { _id: state.user?._id.toString(), firstName, lastName };
      const res = await axios.put('http://localhost:8383/editName', payload);
      const data = res.data;

      if (data.success === false) {
        await delay(500);
        setLoading(false);
        setStatus({ status: 'error', message: data.message });
        await delay(2000);
        setStatus({ status: null, message: ' ' });
        return;
      }

      await delay(500);
      setLoading(false);
      dispatch({ type: 'EDIT_NAME', payload: { firstName, lastName } });
      setStatus({ status: 'success', message: data.message });
      setIsEditingName(false);

      await delay(2000);
      setStatus({ status: null, message: ' ' });

    } catch (err) {
      await delay(500);
      setLoading(false);
      setStatus({ status: 'error', message: (err as Error).message });
      await delay(2000);
      setStatus({ status: null, message: ' ' });
    }
  };


  const removeAvatar = async () => {
    if (!state.user) return;

    const removed = await handleRemoveAvatar(state?.user?._id);

    if (removed?.success === false) {
      console.error(removed.message);
      return;
    }

    setAvatar(null);
  };


  const togglePassVisibility = (field: Field) => {
    setIsPassVisible(prev => {
      const newVisibility = { 
        ...prev,
        [field]: !prev[field] 
      };

      return newVisibility;
    });
  };


  const handlePasswordChange = async () => {
    if (!state.user) return;

    try {
      setLoading(true);
      const res = await changePasswordService(
        state.user._id, 
        currentPassword, 
        newPassword,
        confirmPassword
      );

      if (res.success === false) {
        await delay(500);
        setLoading(false);
        setStatus({ 
          status: 'error', 
          message: res.message 
        });

        await delay(3000);
        setStatus({ status: null, message: ' ' });
        return;
      }

      await delay(500);
      setLoading(false);
      setStatus({ status: 'success', message: res.message });
      setCurrentPassword('');
      setNewPassword('');

      setIsChangingPassword(false);
      setConfirmPassword('');
      await delay(2000);
      setStatus({ status: null, message: ' ' });

    } catch (err) {
      await delay(500);
      setLoading(false);
      setStatus({ status: 'error', message: `${err}` });
      await delay(2000);
      setStatus({ status: null, message: ' ' });
    }
  };


  return (
    <div className="profile-section">
      <div className="profile-picture">
        <h2>Change Avatar</h2>

        <div>
          {avatar ? (
            <img src={avatar} alt="Avatar Preview" />
          ) : (
            <div className="no-avatar">No Avatar</div>
          )}
        </div>

        <div className="avatar-btns">
          <label htmlFor="avatar-upload" className="custom-avatar-upload new-card-btn">
            <input
              id="avatar-upload"
              className="new-card-btn hidden-input"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <span className="material-symbols-outlined">add_a_photo</span>
          </label>

          {avatar && (
            <button className="new-card-btn rmv-avatar-btn custom-avatar-upload" onClick={removeAvatar}>
              <span className="material-symbols-outlined">delete_forever</span>
            </button>
          )}
        </div>
      </div>

      <div className="profile-column">
        <LoadingSpinner isLoading={isLoading} setLoading={setLoading} />

        <div className="profile-info">
          {isEditingName ? (
            <>
              <input
                className="input profile-input"
                type="text"
                value={firstName}
                placeholder='Your First Name'
                onChange={(e) => setFirstName(e.target.value.trim())}
              />
              <input
                className="input profile-input"
                type="text"
                value={lastName}
                placeholder='Your Last Name'
                onChange={(e) => setLastName(e.target.value.trim())}
              />
              <button className="new-card-btn" onClick={handleNameEdit}>
                <span className="material-symbols-outlined">save</span>
                <span>Save</span>
              </button>
            </>
          ) : (
            <>
              <h2>{state.user?.firstName} {state.user?.lastName}</h2>
              <button
                className="new-card-btn" 
                onClick={() => {
                  if (state.user) {
                    setFirstName(state.user.firstName); 
                    setLastName(state.user.lastName); 
                    setIsEditingName(true);
                    setStatus({ status: 'success', message: ' ' });
                  }
                }
              }>
                <span className="material-symbols-outlined">edit</span>
                <span>Edit Name</span>
              </button>
            </>
          )}
        </div>

        <div className="password-section">
          {isChangingPassword? 
            <form
              className="password-change-form" 
              name="password-change-form" 
              onSubmit={(e) => {
              e.preventDefault();
              handlePasswordChange();
            }}>

              <div className="login-pass-wrapper">
                <input
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                  value={newPassword}
                  className="input login-pass-inp" 
                  type={isPassVisible['new']? "text" : "password"} 
                  placeholder="New Password" 
                />

                <button 
                  aria-label={isPassVisible? "Hide password" : "Show password"} 
                  onClick={(e) => {
                    e.preventDefault();
                    togglePassVisibility('new')}
                  } 
                  className="visible-pass-btn"
                >
                  <span 
                    className="material-symbols-outlined visible-pass-icon"
                  >
                    {isPassVisible['new']? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>

              <ul className="password-requirements">
                <ValidationItem label="At least 8 characters" valid={validations.length} />
                <ValidationItem label="At least one lowercase letter" valid={validations.lowercase} />
                <ValidationItem label="At least one uppercase letter" valid={validations.uppercase} />
                <ValidationItem label="At least one number" valid={validations.number} />
                <ValidationItem label="At least one special character (!@#$%^&*)" valid={validations.special} />

                {isPasswordValid && 
                  <li className="validation-item">
                    <span>
                      {newPassword === confirmPassword?
                        "Passwords match" :
                        "Passwords do not match"
                      }
                    </span>

                    <span className={`
                      material-symbols-outlined ${newPassword === confirmPassword? "valid" : "invalid"
                    }`}>
                      {newPassword === confirmPassword? "check" : "close"}
                    </span>
                  </li>
                }
              </ul>

              <div className="login-pass-wrapper">
                <input
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  className="input login-pass-inp" 
                  type={isPassVisible['confirm']? "text" : "password"} 
                  placeholder="Confirm Password" 
                />

                <button 
                  aria-label={isPassVisible? "Hide password" : "Show password"} 
                  onClick={(e) => {
                    e.preventDefault();
                    togglePassVisibility('confirm')}
                  }  
                  className="visible-pass-btn"
                >
                  <span 
                    className="material-symbols-outlined visible-pass-icon"
                  >
                    {isPassVisible['confirm']? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>




              {isPasswordValid && confirmPassword === newPassword &&
                <>
                  <p>Enter your current password</p>
                  <div className="login-pass-wrapper">

                    <input
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setCurrentPassword(e.target.value)}
                      }
                      value={currentPassword}
                      className="input login-pass-inp" 
                      type={isPassVisible['current']? "text" : "password"} 
                      placeholder="Current Password" 
                    />

                    <button 
                      aria-label={isPassVisible? "Hide password" : "Show password"} 
                      onClick={(e) => {
                        e.preventDefault();
                        togglePassVisibility('current')}
                      }  
                      className="visible-pass-btn"
                    >
                      <span className="material-symbols-outlined visible-pass-icon">
                        {isPassVisible['current']? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </>
              }



              {currentPassword &&
                <button className="new-card-btn change-pass-btn">
                  <span className="material-symbols-outlined">encrypted</span>
                  <span>Change Password</span>
                </button>
              }


              <button 
                onClick={() => { 
                  setIsChangingPassword(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }} 
                className="new-card-btn cancel-password-btn"
              >
                <span className="material-symbols-outlined">cancel</span>
                <span>Cancel</span>
              </button>
            </form> :

            <button className="new-card-btn" onClick={() => setIsChangingPassword(true)}>
              <span className="material-symbols-outlined">encrypted</span>
              <span>Change Password</span>
            </button>
          }
        </div>

        <div className={
          status.status === 'success'? 'edit-status success' : 'edit-status error'
        }>
          {status.message}
        </div>
      </div>
    </div>
  );
};

export default Profile;