import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Register.css'; // Ensure you have this CSS file for styling

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '', // Add confirmPassword field
  });
  const [passwordError, setPasswordError] = useState(''); // State for password mismatch error
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
  
    try {
      const response = await axios.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      console.log('Registration successful:', response.data); // Debugging
  
      // Show success pop-up
      toast.success('Registration successful! Redirecting to login page...', {
        autoClose: 3000, // Pop-up will close after 3 seconds
      });
  
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error); // Debugging
  
      // Adjusted error handling to match the response structure
      if (error.response && error.response.data.error.message === 'This email is already registered') {
        toast.error('This email is already registered');
      } else {
        toast.error(error.response?.data?.error?.message || 'Registration failed');
      }
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, confirmPassword: value });

    // Check if passwords match and update error state
    if (formData.password !== value) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  return (
    <div className="register-page">
      {/* Left Side: Logo */}
      <div className="logo-section">
        <h1 className="text-logo">SUMS</h1> {/* Text-based logo */}
        <h2>Self User Management System</h2>
      </div>

      {/* Right Side: Registration Form */}
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <p>Create an account to get started</p>
          </div>
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleConfirmPasswordChange} // Use the new handler
                className={passwordError ? 'error' : ''} // Add error class if passwords don't match
                required
              />
              {passwordError && <p className="error-message">{passwordError}</p>} {/* Display error message */}
            </div>
            <button
              type="submit"
              className="register-button"
              disabled={!!passwordError} // Disable button if passwords don't match
            >
              Register
            </button>
          </form>
          <div className="register-footer">
            <p>
              Already have an account? <a href="/login">Login here</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;