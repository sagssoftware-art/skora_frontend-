import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PrincipalForm.css';

const PrincipalForm = () => {
  const navigate = useNavigate();
  if(localStorage.length>0) {
    navigate('/');
  }

  // ===== STATE MANAGEMENT =====
  const [formData, setFormData] = useState({
    mobileNumber: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    mobileNumber: '',
    password: ''
  });

  const [touched, setTouched] = useState({
    mobileNumber: false,
    password: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // ===== VALIDATION RULES =====
  const validateMobileNumber = (number) => {
    // Sri Lankan phone number validation (10 digits starting with 7)
    const phoneRegex = /^7[0-9]{8}$/;
    const cleanedNumber = number.replace(/\s+/g, '');
    
    if (!number.trim()) {
      return 'Mobile number is required';
    }
    if (!/^\d+$/.test(cleanedNumber)) {
      return 'Mobile number must contain only digits';
    }
    if (cleanedNumber.length !== 9) {
      return 'Mobile number must be 9 digits (excluding +94)';
    }
    if (!phoneRegex.test(cleanedNumber)) {
      return 'Please enter a valid Sri Lankan number starting with 7';
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
    if (password.length > 50) {
      return 'Password is too long (max 50 characters)';
    }
    return '';
  };

  // ===== REAL-TIME VALIDATION =====
  useEffect(() => {
    const mobileError = validateMobileNumber(formData.mobileNumber);
    const passwordError = validatePassword(formData.password);

    setErrors({
      mobileNumber: touched.mobileNumber ? mobileError : '',
      password: touched.password ? passwordError : ''
    });

    // Enable submit button only when both fields are valid
    setIsFormValid(
      !mobileError && 
      !passwordError && 
      formData.mobileNumber.trim() !== '' && 
      formData.password.trim() !== ''
    );
  }, [formData, touched]);

  // ===== INPUT HANDLERS =====
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // For mobile number, only allow digits
    if (name === 'mobileNumber') {
      const digitsOnly = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: digitsOnly
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear submit messages when user starts typing
    if (submitError) setSubmitError('');
    if (submitSuccess) setSubmitSuccess(false);
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
    setTouched({ mobileNumber: true, password: true });

    // Final validation check
    const mobileError = validateMobileNumber(formData.mobileNumber);
    const passwordError = validatePassword(formData.password);

    if (mobileError || passwordError) {
      setErrors({
        mobileNumber: mobileError,
        password: passwordError
      });
      return;
    }

    // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const userData = {
        mobileNumber: "0" +formData.mobileNumber.replace(/\s+/g, ''),
        password: formData.password
      };
      console.log(userData);
      

      const response = await axios.post(
        'http://localhost:3000/principal/login',
        userData,
        {
          timeout: 10000, // 10 second timeout
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.msg) {
        // Store session
        localStorage.setItem('SKORAPRINsession', response.data.principal.user.number);
        
        // Show success state
        setSubmitSuccess(true);
        
        // Navigate after short delay for better UX
        setTimeout(() => {
          navigate('/dashboard/principal');
        }, 800);
      } else {
        setSubmitError('Invalid credentials. Please check and try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // User-friendly error messages based on error type
      if (error.code === 'ECONNABORTED') {
        setSubmitError('Request timed out. Please check your connection.');
      } else if (error.response?.status === 401 || error.response?.status === 400) {
        setSubmitError('Invalid mobile number or password');
      } else if (error.response?.status === 404) {
        setSubmitError('Account not found. Please register first.');
      } else if (error.response?.status === 429) {
        setSubmitError('Too many login attempts. Please try again later.');
      } else if (!error.response) {
        setSubmitError('Cannot connect to server. Please check your internet.');
      } else {
        setSubmitError(error.response?.data?.msg || 'Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===== RENDER =====
  return (
    <div className="principal-login-container">
      <div className="principal-login-card">
        
        {/* Header */}
        <div className="principal-login-header">
          <div className="principal-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 className="principal-login-title">Principal Login</h1>
          <p className="principal-login-subtitle">Access your administrative dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="principal-login-form" noValidate>
          
          {/* Mobile Number Field */}
          <div className="principal-form-group">
            <label htmlFor="mobileNumber" className="principal-form-label">
              Mobile Number
            </label>
            <div className="principal-input-wrapper">
              <span className="principal-input-prefix">+94</span>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                onBlur={() => handleBlur('mobileNumber')}
                onFocus={() => handleFocus('mobileNumber')}
                placeholder="771234567"
                maxLength="9"
                className={`principal-form-input ${
                  errors.mobileNumber ? 'principal-input-error' : ''
                } ${
                  touched.mobileNumber && !errors.mobileNumber && formData.mobileNumber 
                    ? 'principal-input-success' 
                    : ''
                }`}
                disabled={isSubmitting || submitSuccess}
                autoComplete="tel"
                inputMode="numeric"
              />
            </div>
            {errors.mobileNumber && (
              <p className="principal-error-message">
                <span className="principal-error-icon">⚠</span>
                {errors.mobileNumber}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="principal-form-group">
            <label htmlFor="password" className="principal-form-label">
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
              className={`principal-form-input ${
                errors.password ? 'principal-input-error' : ''
              } ${
                touched.password && !errors.password && formData.password 
                  ? 'principal-input-success' 
                  : ''
              }`}
              disabled={isSubmitting || submitSuccess}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="principal-error-message">
                <span className="principal-error-icon">⚠</span>
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Error Message */}
          {submitError && (
            <div className="principal-submit-error">
              <span className="principal-error-icon">✕</span>
              {submitError}
            </div>
          )}

          {/* Submit Success Message */}
          {submitSuccess && (
            <div className="principal-submit-success">
              <span className="principal-success-icon">✓</span>
              Login successful! Redirecting...
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`principal-submit-button ${submitSuccess ? 'principal-button-success' : ''}`}
            disabled={!isFormValid || isSubmitting || submitSuccess}
          >
            {submitSuccess ? (
              <>
                <span className="principal-checkmark">✓</span>
                Success!
              </>
            ) : isSubmitting ? (
              <>
                <span className="principal-spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Register Link */}
          <div className="principal-form-footer">
            <p className="principal-footer-text">
              Don't have an account?{' '}
              <Link 
                to="/register/principal" 
                className="principal-footer-link"
                tabIndex={isSubmitting ? -1 : 0}
              >
                Register as Principal
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrincipalForm;