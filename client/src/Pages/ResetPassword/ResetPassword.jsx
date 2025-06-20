import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../Api/axiosConfig';
import styles from './ResetPassword.module.css';
import { toast } from 'react-toastify';

function ResetPassword() {
  const { token } = useParams(); // Extract the token from the URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleResetPassword(e) {
    e.preventDefault();

    if (!newPassword.trim()) {
      toast.error('Password is required.');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    try {
      setIsLoading(true);
      await axiosInstance.post('/users/verify-reset-token', {
        token,
        newPassword,
      });
      toast.success('Password reset successfully!');
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(error?.response?.data?.msg || 'Error resetting password.');
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.resetPasswordContainer}>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={styles.passwordInput}
        />
        <button type="submit" className={styles.resetButton}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
