import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Login.css'; // Custom CSS for advanced styling

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      console.log('Login successful, token:', response.data.token); // Debugging

      // Fetch user details after successful login
      const userResponse = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${response.data.token}` },
      });
      console.log('User details:', userResponse.data); // Debugging
      localStorage.setItem('user', JSON.stringify(userResponse.data));

      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error); // Debugging
      if (error.response?.data?.error?.message === 'Account is blocked') {
        toast.error('Your account is blocked. Please contact support.'); // Toast for blocked account
      } else {
        toast.error(error.response?.data?.error || 'Login failed'); // Generic error toast
      }
    }
  };

  return (
    <div className="login-page">
      {/* Left Side: Logo */}
      <div className="logo-section">
        <h1 className="text-logo">SUMS</h1> {/* Text-based logo */}
        <h2>Self User Management System</h2>
      </div>

      {/* Right Side: Login Form */}
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <p>Sign in to continue to your account</p>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <button type="submit" className="login-button">Sign In</button>
          </form>
          <div className="login-footer">
            <p>
              Don't have an account? <Link to="/register">Register here</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;