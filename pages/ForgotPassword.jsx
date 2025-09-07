import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/forgot-password',
        { email },
        { withCredentials: true }
      );
      setMessage(res.data.message || '✅ Reset link sent to your email!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || '❌ Something went wrong.');
    }
  };

  return (
    <div className="forgotpass-container">
      <div className="forgotpass-box">
        <h2 className="forgotpass-title">Forgot Your Password?</h2>

        {error && <p className="forgotpass-error">{error}</p>}
        {message && <p className="forgotpass-success">{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="forgotpass-input-group">
            <label className="forgotpass-label">Email Address</label>
            <input
              type="email"
              className="forgotpass-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="forgotpass-button">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
