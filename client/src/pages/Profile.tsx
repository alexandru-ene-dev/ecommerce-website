import { useState, useEffect, type ChangeEvent } from 'react';
import userPic from '../assets/images/user.png';
import { useAuthContext } from '../hooks/useAuthContext';
import axios from 'axios';
import delay from '../utils/delay';
import { useAvatar } from '../context/AuthContext/AvatarContext';


type Status = {
  status: 'error' | 'success' | null,
  message: string
};


const Profile = () => {
  const { state } = useAuthContext();
  const [firstName, setFirstName] = useState<string | undefined>('');
  const [lastName, setLastName] = useState<string | undefined>('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [password, setPassword] = useState('');
  const [ status, setStatus ] = useState<Status>({ status: null, message: ' '});

  // const [avatar, setAvatar] = useState<string | null>(null);
  const { avatar, setAvatar } = useAvatar();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
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
  }

  const handlePasswordChange = () => alert("Password change logic not implemented");


  const handleNameEdit = async () => {
    setStatus({ status: null, message: ' ' });
    
    if (
      (!firstName || firstName === ' ' && !lastName || lastName === ' ') ||
      (!firstName || firstName === ' ' || !lastName || lastName === ' ') ||
      (
        Array.from(new Set(firstName.split(''))).join('') === ' ' ||
        Array.from(new Set(firstName.split(''))).join('') === ' '
      )
    ) {
      setStatus({ status: 'error', message: 'Fields must not be empty' });
      await delay(2000);
      setStatus({ status: null, message: ' ' });
      return;
    }

    try {
      const payload = { _id: state.user?._id.toString(), firstName, lastName };
      const res = await axios.put('http://localhost:8383/editName', payload);
      const data = res.data;

      if (data.success === false) {
        setStatus({ status: 'error', message: data.message });
        await delay(2000);
        setStatus({ status: null, message: ' ' });
        return;
      }
      
      setStatus({ status: 'success', message: data.message });
      setIsEditingName(false);
      await delay(2000);
      setStatus({ status: null, message: ' ' });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setStatus({ status: 'error', message: `Request error: ${(err as Error).message}` });
      }

      setStatus({ status: 'error', message: (err as Error).message });
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

            <input
              className="new-card-btn"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
  


          
          <div className="profile-column">
            <div 
              className={status.status === 'success'? 'edit-status success' : 'edit-status error'}
            >
              {status.message}
            </div>

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
                    onClick={
                      () => {
                      setFirstName(state.user?.firstName); 
                      setLastName(state.user?.lastName); 
                      setIsEditingName(true);
                      setStatus({ status: 'success', message: ' ' });
                    }
                  }>
                    <span className="material-symbols-outlined">edit</span>
                    <span>Edit Name</span>
                  </button>
                </>
              )}
            </div>

            <div className="password-section">
              <input
                className="input"
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="new-card-btn" onClick={handlePasswordChange}>
                <span className="material-symbols-outlined">encrypted</span>
                <span>Change Password</span>
              </button>
            </div>
          </div>
        </div>
  );
};

export default Profile;