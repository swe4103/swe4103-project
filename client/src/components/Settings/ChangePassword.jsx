import axios from 'axios';
import { useState } from 'react';
import { useAuth } from '../../state/AuthProvider/AuthProvider';

const ChangePassword = () => {
  const { user, updateUser } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setFeedbackMessage('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFeedbackMessage('');
  };

  const handleUpdatePassword = async () => {
    if (oldPassword.trim() === '' || newPassword.trim() === '') {
      setFeedbackMessage('Both old and new passwords are required.');
    } else {
      try {
        // Call the backend to change the password
        const response = await axios.put(
          `/api/users/${user.user.id}/change-password`,
          { oldPassword, newPassword },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setFeedbackMessage('Password updated successfully!');
        setOldPassword('');
        setNewPassword('');
        setIsModalOpen(false);
      } catch (error) {
        setFeedbackMessage(error.response?.data?.message || 'Failed to update password.');
      }
    }
  };

  return (
    <div>
      <button onClick={handleOpenModal}>Change Password</button>
      {isModalOpen && (
        <div>
          <input
            type="password"
            value={oldPassword}
            onChange={handleOldPasswordChange}
            placeholder="Enter your old password"
          />
          <input
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder="Enter your new password"
          />
          <button onClick={handleUpdatePassword}>Save</button>
          <button onClick={handleCloseModal}>Cancel</button>
          {feedbackMessage && <p>{feedbackMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
