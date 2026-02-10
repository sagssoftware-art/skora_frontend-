import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TeacherForm.css';

const TeacherForm = () => {
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
  const [showPassword, setShowPassword] = useState(false);

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
      return 'Number must start with 7 (e.g., 771234567)';
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

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
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
        mobileNumber: "0"+ formData.mobileNumber.replace(/\s+/g, ''),
        password: formData.password
      };
      console.log(userData);
      
      const response = await axios.post(
        'http://localhost:3000/teachers/login',
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
        console.log(response.data)
        localStorage.setItem('SKORATEAsession', response.data.teacher.number);
        
        // Show success state
        setSubmitSuccess(true);
        
        // Navigate after short delay for better UX
        setTimeout(() => {
          navigate('/dashboard/teacher');
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
    <div className="teacher-login-container">
      <div className="teacher-login-card">
        
        {/* Header */}
        <div className="teacher-login-header">
          <div className="teacher-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
          </div>
          <h1 className="teacher-login-title">Teacher Portal</h1>
          <p className="teacher-login-subtitle">Sign in to manage your classes</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="teacher-login-form" noValidate>
          
          {/* Mobile Number Field */}
          <div className="teacher-form-group">
            <label htmlFor="mobileNumber" className="teacher-form-label">
              Mobile Number
            </label>
            <div className="teacher-input-wrapper">
              <span className="teacher-input-prefix">+94</span>
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
                className={`teacher-form-input ${
                  errors.mobileNumber ? 'teacher-input-error' : ''
                } ${
                  touched.mobileNumber && !errors.mobileNumber && formData.mobileNumber 
                    ? 'teacher-input-success' 
                    : ''
                }`}
                disabled={isSubmitting || submitSuccess}
                autoComplete="tel"
                inputMode="numeric"
              />
            </div>
            {errors.mobileNumber && (
              <p className="teacher-error-message">
                <span className="teacher-error-icon">⚠</span>
                {errors.mobileNumber}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="teacher-form-group">
            <label htmlFor="password" className="teacher-form-label">
              Password
            </label>
            <div className="teacher-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={() => handleBlur('password')}
                onFocus={() => handleFocus('password')}
                placeholder="Enter your password"
                className={`teacher-form-input ${
                  errors.password ? 'teacher-input-error' : ''
                } ${
                  touched.password && !errors.password && formData.password 
                    ? 'teacher-input-success' 
                    : ''
                }`}
                disabled={isSubmitting || submitSuccess}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="teacher-password-toggle"
                onClick={togglePasswordVisibility}
                disabled={isSubmitting || submitSuccess}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="teacher-error-message">
                <span className="teacher-error-icon">⚠</span>
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Error Message */}
          {submitError && (
            <div className="teacher-submit-error">
              <span className="teacher-error-icon">✕</span>
              {submitError}
            </div>
          )}

          {/* Submit Success Message */}
          {submitSuccess && (
            <div className="teacher-submit-success">
              <span className="teacher-success-icon">✓</span>
              Login successful! Redirecting to dashboard...
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`teacher-submit-button ${submitSuccess ? 'teacher-button-success' : ''}`}
            disabled={!isFormValid || isSubmitting || submitSuccess}
          >
            {submitSuccess ? (
              <>
                <span className="teacher-checkmark">✓</span>
                Success!
              </>
            ) : isSubmitting ? (
              <>
                <span className="teacher-spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Register Link */}
          <div className="teacher-form-footer">
            <p className="teacher-footer-text">
              Don't have an account?{' '}
              <Link 
                to="/register/teacher" 
                className="teacher-footer-link"
                tabIndex={isSubmitting ? -1 : 0}
              >
                Register as Teacher
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherForm;