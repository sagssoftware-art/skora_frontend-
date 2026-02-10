import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StudentForm.css';

const StudentForm = () => {
  const navigate = useNavigate();
  if(localStorage.length>0) {
    navigate('/');
  }
  // ===== STATE MANAGEMENT =====
  const [formData, setFormData] = useState({
    number: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    number: '',
    password: ''
  });

  const [touched, setTouched] = useState({
    number: false,
    password: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  // ===== VALIDATION RULES =====
  const validatePhone = (phone) => {
    // Sri Lankan phone number validation (10 digits starting with 7)
    const phoneRegex = /^7[0-9]{8}$/;
    const cleanedPhone = phone.replace(/\s+/g, '');
    
    if (!phone.trim()) {
      return 'Phone number is required';
    }
    if (!/^\d+$/.test(cleanedPhone)) {
      return 'Phone number must contain only digits';
    }
    if (!phoneRegex.test(cleanedPhone)) {
      return 'Please enter a valid Sri Lankan number (e.g., 771234567)';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  // ===== REAL-TIME VALIDATION =====
  useEffect(() => {
    const phoneError = validatePhone(formData.number);
    const passwordError = validatePassword(formData.password);

    setErrors({
      number: touched.number ? phoneError : '',
      password: touched.password ? passwordError : ''
    });

    // Enable submit button only when both fields are valid and touched
    setIsFormValid(
      !phoneError && 
      !passwordError && 
      formData.number.trim() !== '' && 
      formData.password.trim() !== ''
    );
  }, [formData, touched]);

  // ===== INPUT HANDLERS =====
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear submit error when user starts typing again
    if (submitError) setSubmitError('');
  };

  const handleBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleFocus = (field) => {
    // Clear field-specific error on focus for better UX
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  // ===== FORM SUBMISSION =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ number: true, password: true });

    // Final validation check
    const phoneError = validatePhone(formData.number);
    const passwordError = validatePassword(formData.password);

    if (phoneError || passwordError) {
      setErrors({
        number: phoneError,
        password: passwordError
      });
      return;
    }

    // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const userData = {
        number: "0" + formData.number.replace(/\s+/g, ''), // Clean whitespace
        password: formData.password
      };
      console.log(userData);
      
      const response = await axios.post(
        'http://localhost:3000/students/login',
        userData
      );

      if (response.data.msg) {
        // Store session
        localStorage.setItem('SKORASTUsession', "0" + formData.number);
        
        // Small delay for better UX (shows success state)
        setTimeout(() => {
          window.location.href = '/dashboard/student';
        }, 300);
      } else {
        setSubmitError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // User-friendly error messages
      if (error.response?.status === 401) {
        setSubmitError('Invalid phone number or password');
      } else if (error.response?.status === 404) {
        setSubmitError('Account not found. Please register first.');
      } else if (!error.response) {
        setSubmitError('Cannot connect to server. Please try again.');
      } else {
        setSubmitError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== RENDER =====
  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to continue to your dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          
          {/* Phone Number Field */}
          <div className="form-group">
            <label htmlFor="number" className="form-label">
              Phone Number
            </label>
            <div className="input-wrapper">
              <span className="input-prefix">+94</span>
              <input
                type="tel"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                onBlur={() => handleBlur('number')}
                onFocus={() => handleFocus('number')}
                placeholder="771234567"
                className={`form-input ${errors.number ? 'input-error' : ''} ${
                  touched.number && !errors.number && formData.number ? 'input-success' : ''
                }`}
                disabled={isSubmitting}
                autoComplete="tel"
              />
            </div>
            {errors.number && (
              <p className="error-message">
                <span className="error-icon">⚠</span>
                {errors.number}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={() => handleBlur('password')}
              onFocus={() => handleFocus('password')}
              placeholder="Enter your password"
              className={`form-input ${errors.password ? 'input-error' : ''} ${
                touched.password && !errors.password && formData.password ? 'input-success' : ''
              }`}
              disabled={isSubmitting}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="error-message">
                <span className="error-icon">⚠</span>
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Error Message */}
          {submitError && (
            <div className="submit-error">
              <span className="error-icon">✕</span>
              {submitError}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-button"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Register Link */}
          <div className="form-footer">
            <p className="footer-text">
              Don't have an account?{' '}
              <Link to="/register/student" className="footer-link">
                Create one
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;