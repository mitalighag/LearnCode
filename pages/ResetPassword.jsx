import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ResetPassword.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError("❌ Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
        password,
      });
      

      setMessage(response.data.message || "✅ Password has been reset!");

      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error("Reset Password Error:", err.response || err);
      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "❌ Invalid or expired token. Please try again.";
      setError(errMsg);
    }
  };

  return (
    <div className="resetpass-container">
      <div className="resetpass-box">
        <h2 className="resetpass-title">Reset Your Password</h2>

        {error && <p className="resetpass-error">{error}</p>}
        {message && <p className="resetpass-success">{message} Redirecting to login...</p>}

        <form onSubmit={handleSubmit}>
          <div className="resetpass-input-group">
            <label className="resetpass-label">New Password</label>
            <input
              type="password"
              className="resetpass-input"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="resetpass-input-group">
            <label className="resetpass-label">Confirm Password</label>
            <input
              type="password"
              className="resetpass-input"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="resetpass-button">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
