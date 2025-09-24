import { useState, useEffect, type ChangeEvent } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import delay from '../utils/delay';
import { useAvatar } from '../context/AuthContext/AvatarContext';
import { uploadAvatar } from '../services/uploadAvatarService';

import { handleRemoveAvatar } from '../services/removeAvatarService';
import { changePasswordService } from '../services/changePasswordService';
import LoadingSpinner from '../components/LoadingSpinner';
import ValidationItem from '../components/ValidationItem';

import editNameService from '../services/editNameService';
import syncService from '../services/syncService';
import { getLocalFavorites } from '../utils/localFavorites';
import { getCart } from '../utils/cartStorage';

import useFavoritesContext from '../hooks/useFavoritesContext';
import useCartContext from '../hooks/useCartContext';
import deleteAccountService from '../services/deleteAccountService';
import { useNavigate } from 'react-router-dom';

import RemoveIcon from '../images/icons/delete-icon.svg?component';
import CancelIcon from '../images/icons/cancel-icon.svg?component';
import CloseIcon from '../images/icons/close-icon.svg?component';
import EditIcon from '../images/icons/edit-icon.svg?component';
import SyncIcon from '../images/icons/sync-icon.svg?component';
import EncryptedIcon from '../images/icons/encrypted-icon.svg?component';

import AddPhotoIcon from '../images/icons/add-photo-icon.svg?component';
import SaveIcon from '../images/icons/save-icon.svg?component';
import VisibilityOnIcon from '../images/icons/visibility-icon.svg?component';
import VisibilityOffIcon from '../images/icons/visibility-off-icon.svg?component';
import CheckIcon from '../images/icons/check-icon.svg?component';



type Status = {
  status: 'error' | 'success' | null,
  message: string
};

type Field = 'current' | 'new' | 'confirm';


const Profile = () => {
  const { state, dispatch } = useAuthContext();
  const [ firstName, setFirstName ] = useState<string | ''>('');
  const [ lastName, setLastName ] = useState<string | ''>('');
  const [ isEditingName, setIsEditingName ] = useState(false);
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
  const [ isProfileLoading, setIsProfileLoading ] = useState(true);
  

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
  const [ syncMode, setSyncMode ] = useState(false);
  const [ syncConfirm, setSyncConfirm ] = useState(false);

  const [ favCheckbox, setFavCheckbox ] = useState(false);
  const [ cartCheckbox, setCartCheckbox ] = useState(false);
  const [ syncError, setSyncError ] = useState('');
  const { setLocalFavorites } = useFavoritesContext();
  const { setLocalCart } = useCartContext();

  const [ avatarStatus, setAvatarStatus ] = useState<Status>({ status: null, message: ' '});
  const [ avatarLoading, setAvatarLoading ] = useState(false);
  const [ confirmDeleteAccount, setConfirmDelete ] = useState(false);
  const navigate = useNavigate();


  let syncConfirmMessage: string = '';

  if (favCheckbox && !cartCheckbox) {
    syncConfirmMessage = 'You are about to overwrite your user favorites with your in-browser locally saved ones.'
  } else if (!favCheckbox && cartCheckbox) {
    syncConfirmMessage = 'You are about to overwrite your user cart with your in-browser locally saved one.'
  } else {
    syncConfirmMessage = 'You are about to overwrite your user cart and favorites with your in-browser locally saved ones.'
  }


  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };

    reader.readAsDataURL(file);

    try {
      setAvatarLoading(true);
      const userId = state.user?._id;
      if (!userId) return;

      const result = await uploadAvatar(userId, file);

      if (!result.success) {
        setAvatarStatus({ status: 'error', message: 'Avatar update failed' });
        return;
      }

      setAvatarStatus({ status: 'success', message: 'Avatar update was successful!' });
    } catch (err) {
      setAvatarStatus({ 
        status: 'error', 
        message: `Avatar update failed: ${(err as Error).message}` 
      });

    } finally {
      await delay(1000);
      setAvatarLoading(false);
      await delay(3000);
      setAvatarStatus({ status: null, message: '' });
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
      
      await delay(3000);
      setStatus({ status: null, message: ' ' });
      return;
    }

    try {
      if (!state?.user?._id) return;
      const res = await editNameService(state?.user?._id.toString(), firstName, lastName);

      if (res.success === false) {
        await delay(500);
        setLoading(false);
        setStatus({ status: 'error', message: res.message });
        await delay(2000);
        setStatus({ status: null, message: ' ' });
        return;
      }

      await delay(500);
      setLoading(false);
      dispatch({ type: 'EDIT_NAME', payload: { firstName, lastName } });
      setStatus({ status: 'success', message: res.message });
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

    setAvatarLoading(true);
    try {
      const removed = await handleRemoveAvatar(state?.user?._id);
  
      if (removed?.success === false) {
        setAvatarStatus({ status: 'error', message: 'Avatar remove failed' });
        return;
      }
  
      await delay(1000);
      setAvatarLoading(false);
      setAvatar(null);
      setAvatarStatus({ status: 'success', message: 'Avatar remove was successful' });
    } catch (err) {
      setAvatarStatus({ 
        status: 'error', 
        message: `Avatar remove failed: ${err as Error}.message` 
      });

    } finally {
      await delay(1000);
      setAvatarLoading(false);
      await delay(3000);
      setAvatarStatus({ status: null, message: '' });
    }
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

  
  const handleSync = async () => {
    setLoading(true);

    try {
      if (!state.user) return;
      const res = await syncService(favCheckbox, cartCheckbox, state.user._id);

      await delay(700);
      setLoading(false);

      if (!res.success) {
        setStatus({ status: 'error', message: res.message });
        setSyncMode(false);
        return;
      }
      
      setSyncMode(false);
      setSyncConfirm(false);
      setStatus({ status: 'success', message: 'Successful sync!' });
      setCartCheckbox(false);
      setFavCheckbox(false);
      
      const localFav = getLocalFavorites();
      const localCart = getCart();

      if (favCheckbox) {
        setLocalFavorites(localFav);
      }

      if (cartCheckbox) {
        setLocalCart(localCart);
      }

      await delay(2000);
      setStatus({ status: null, message: ' '});

    } catch (err) {
      setStatus({ status: 'error', message: (err as Error).message });
      setSyncMode(false);
    }
  };


  const handleDelete = async () => {
    if (!state.user?._id) return;

    const result = await deleteAccountService(state.user._id);

    if (!result.success) {
      setStatus({ status: 'error', message: 'We couldn\'t delete the account' });
      return;
    }

    dispatch({ type: "LOGOUT", payload: null });
    navigate('/goodbye')
    setStatus({ status: 'success', message: 'The account was successfully deleted' });
    
    sessionStorage.setItem('deletedAccount', 'true');
    await delay(1000);
  };


  useEffect(() => {
    const loadProfile = async () => {
      if (!state.isLoggedIn) {
        setIsProfileLoading(true);
        await delay(500);
        setIsProfileLoading(false);
      } else {
        await delay(500);
        setIsProfileLoading(false);
      }
    }

    loadProfile();
  }, [state.isLoggedIn]);


  if (isProfileLoading) {
    return (
      <section className="items-page loading">
        <h1 className="category-page-title">Loading Profile...</h1>

        <LoadingSpinner isLoading={isProfileLoading} />
      </section>
    );
  }


  if (!state.isLoggedIn) {
    setIsProfileLoading(false);
    navigate('/login');
  }
  

  return (
    <div className="profile-section">
      <div className="profile-picture">
        <h2>Change Avatar</h2>

        <div className="avatar-wrapper">
          {avatar ? (
            <img src={avatar} alt="Avatar Preview" />
          ) : (
            <div className="no-avatar">No Avatar</div>
          )}

          <LoadingSpinner isLoading={avatarLoading} />
        </div>

        <div className="avatar-btns">
          <label htmlFor="avatar-upload" className="avatar-btn">
            <input
              aria-label="Add or change avatar"
              id="avatar-upload"
              className="hidden-input"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <AddPhotoIcon />
          </label>

          {avatar && (
            <button
              aria-label="Remove avatar" 
              className="avatar-btn" 
              onClick={removeAvatar}
            >
              <RemoveIcon />
            </button>
          )}
        </div>

        {avatarStatus && 
          <div 
            aria-live="polite" 
            className={`edit-status ${avatarStatus.status === 'error'? 'error' : 'success'}`}
          >
            {avatarStatus.message}
          </div>
        }
      </div>

      <div className="profile-column">
        <LoadingSpinner isLoading={isLoading} />

        <div className="profile-info">
          {isEditingName ? (
            <div
              aria-labelledby="confirmation" 
              role="dialog" 
              aria-modal="true"  
              className="edit-menu"
            >
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
                <SaveIcon />
                <span>Save</span>
              </button>

              <button className="new-card-btn" onClick={() => setIsEditingName(false)}>
                <CancelIcon />
                <span>Cancel</span>
              </button>
            </div>
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
                <EditIcon />
                <span>Edit Name</span>
              </button>
            </>
          )}
        </div>


        {syncMode ? 
          <div
            aria-labelledby="sync" 
            role="dialog" 
            aria-modal="true"  
            className="sync-menu"
          >
            <h2 id="sync">Sync your cart and favorites from your browser storage</h2>

            <label htmlFor="cart">
              <input 
                id="cart" 
                type="checkbox" 
                checked={cartCheckbox? true: false} 
                onChange={() => {
                  setSyncError('');
                  setCartCheckbox(prev => !prev);
                }} 
              />
              Sync your cart
            </label>

            <label htmlFor="favorites">
              <input 
                id="favorites" 
                type="checkbox"
                checked={favCheckbox? true: false} 
                onChange={() => {
                  setSyncError('');
                  setFavCheckbox(prev => !prev);
                }}  
              />
              Sync your favorites
            </label>

            {syncError && <p className="edit-status sync-error">{syncError}</p>}


            <button
              className="new-card-btn" 
              onClick={() => {
                if (!favCheckbox && !cartCheckbox) {
                  setSyncError('You must check at least one of the 2 options from above');
                  return;
                }
                setSyncConfirm(true);
              }}
            >
              <SyncIcon />
              <span>Sync</span>
            </button>

            <button
              className="new-card-btn" 
              onClick={() => {
                setSyncMode(false);
                setCartCheckbox(false);
                setFavCheckbox(false);
                setSyncError('');
              }}
            >
              <CancelIcon />
              <span>Cancel</span>
            </button>

            {syncConfirm && 
              <div className="sync-confirm">
                <p>{syncConfirmMessage}</p>
                <p>Continue?</p>

                <button
                  className="new-card-btn" 
                  onClick={() => handleSync()}
                >
                  <SyncIcon />
                  <span>Yes, sync from browser local storage</span>
                </button>

                <button
                  className="new-card-btn" 
                  onClick={() => setSyncConfirm(false)}
                >
                  <CancelIcon />
                  <span>Cancel</span>
                </button>
              </div>
            }
          </div> :

          <button
            className="new-card-btn" 
            onClick={() => setSyncMode(true)}
          >
            <SyncIcon />
            <span>Sync Cart and Favorites</span>
          </button>
        }


        <div className="password-section">
          {isChangingPassword? 
            <form
              aria-label="Change your password" 
              role="dialog" 
              aria-modal="true" 
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
                  {isPassVisible['new']? <VisibilityOffIcon /> : <VisibilityOnIcon />}
                </button>
              </div>

              <ul aria-live="polite" className="password-requirements">
                <ValidationItem label="At least 8 characters" valid={validations.length} />
                <ValidationItem label="At least one lowercase letter" valid={validations.lowercase} />
                <ValidationItem label="At least one uppercase letter" valid={validations.uppercase} />
                <ValidationItem label="At least one number" valid={validations.number} />
                <ValidationItem label="At least one special character (!@#$%^&*)" valid={validations.special} />

                {isPasswordValid && 
                  <li className="validation-item">
                    <span>
                      {newPassword === confirmPassword ?
                        "Passwords match" :
                        "Passwords do not match"
                      }
                    </span>

                    {newPassword === confirmPassword? <CheckIcon /> : <CloseIcon />}
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
                  {isPassVisible['confirm']? <VisibilityOffIcon /> : <VisibilityOnIcon />}
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
                      <span aria-hidden="true" className="material-symbols-outlined visible-pass-icon">
                        {isPassVisible['current']? <VisibilityOffIcon /> : <VisibilityOnIcon />}
                      </span>
                    </button>
                  </div>
                </>
              }


              {currentPassword &&
                <button className="new-card-btn change-pass-btn">
                  <span aria-hidden="true" className="material-symbols-outlined">encrypted</span>
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
                <CancelIcon />
                <span>Cancel</span>
              </button>
            </form> :

            <button className="new-card-btn" onClick={() => setIsChangingPassword(true)}>
              <EncryptedIcon />
              <span>Change Password</span>
            </button>
          }
        </div>


        <div className="delete-account-section">
          {confirmDeleteAccount ? 
            (
              <div 
                aria-labelledby="delete-confirmation" 
                role="dialog" 
                aria-modal="true" 
                className="delete-confirm-modal"
              >
                <p id="delete-confirmation">Are you sure you want to delete your account? This will remove all your data, including your favorites, cart and premium points. This cannot be undone.</p>

                <button 
                  onClick={handleDelete} 
                  className="new-card-btn delete"
                >
                  <RemoveIcon />
                  <span>Yes, delete</span>
                </button>

                <button 
                  onClick={() => setConfirmDelete(false)} 
                  className="new-card-btn cancel"
                >
                  <CancelIcon />
                  <span>Cancel</span>
                </button>
              </div>
            ) :
            
            <button
              onClick={() => setConfirmDelete(true)}
              className="new-card-btn delete"
            >
              <RemoveIcon />
              <span>Delete Account</span>
            </button>
          }
        </div>



        {status.status && 
          <div aria-live="polite" className={
            status.status === 'success'? 'edit-status success' : 'edit-status error'
          }>
            {status.message}
          </div>
        }
      </div>
    </div>
  );
};

export default Profile;