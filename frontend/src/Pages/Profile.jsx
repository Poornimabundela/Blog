import React, { useEffect, useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { patch } from '../services/Endpoint';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { setUser } from '../redux/AuthSlice';

export default function Profile() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [name, setName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.FullName || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('FullName', name);
    formData.append('oldpassword', oldPassword);
    formData.append('newpassword', newPassword);

    try {
      const response = await patch(`auth/profile/${userId}`, formData);
      const data = response.data;

      if (response.status === 200) {
        toast.success(data.message);
        dispatch(setUser(data.user));
        setOldPassword('');
        setNewPassword('');
      }
    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Update Profile</h1>

      {/* Just showing name instead of image */}
      <h3 className="text-center mb-4 text-lg font-semibold">{user?.FullName}</h3>

      <form className="profile-form" onSubmit={handleUpdateProfile}>
        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="text"
            placeholder="Update Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="profile-input"
            required
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="profile-input"
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="profile-input"
          />
        </div>

        <button type="submit" className="profile-button">
          Update Profile
        </button>
      </form>
    </div>
  );
}
