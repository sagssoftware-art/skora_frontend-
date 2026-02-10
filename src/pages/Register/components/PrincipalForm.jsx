import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import './PrincipalForm.css';
import axios from 'axios';

const PrincipalForm = () => {
const navigate = useNavigate();
  if(localStorage.length>0) {
    navigate('/');
  }
    // Form state management
    const [formData, setFormData] = useState({
        fullname: '',
        number: '',
        password: '',
        passwordCon: ''
    });

    // Validation errors state
    const [errors, setErrors] = useState({});
    
    // Touched fields (to show errors only after user interaction)
    const [touched, setTouched] = useState({});
    
    // Loading state for submission
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form validity state
    const [isFormValid, setIsFormValid] = useState(false);

    // Validation rules
    const validationRules = {
        fullname: (value) => {
            if (!value.trim()) return 'Full name is required';
            if (value.trim().length < 3) return 'Name must be at least 3 characters';
            if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name should only contain letters';
            return '';
        },
        number: (value) => {
            if (!value.trim()) return 'Phone number is required';
            const phoneRegex = /^(\+94|0)?[1-9]\d{8}$/;
            if (!phoneRegex.test(value.replace(/[\s-]/g, ''))) {
                return 'Invalid phone number (e.g., 0771234567 or +94771234567)';
            }
            return '';
        },
        password: (value) => {
            if (!value) return 'Password is required';
            if (value.length < 8) return 'Password must be at least 8 characters';
            if (!/[A-Za-z]/.test(value)) return 'Password must contain at least one letter';
            if (!/\d/.test(value)) return 'Password must contain at least one number';
            return '';
        },
        passwordCon: (value) => {
            if (!value) return 'Please confirm your password';
            if (value !== formData.password) return 'Passwords do not match';
            return '';
        }
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle blur event (when user leaves a field)
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
    };

    // Validate all fields
    useEffect(() => {
        const newErrors = {};
        Object.keys(formData).forEach(field => {
            const error = validationRules[field](formData[field]);
            if (error) {
                newErrors[field] = error;
            }
        });
        setErrors(newErrors);
        
        // Check if form is valid
        setIsFormValid(Object.keys(newErrors).length === 0);
    }, [formData]);

    // Get field status (for styling)
    const getFieldStatus = (fieldName) => {
        if (!touched[fieldName]) return 'neutral';
        return errors[fieldName] ? 'error' : 'success';
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Mark all fields as touched
        const allTouched = {};
        Object.keys(formData).forEach(key => {
            allTouched[key] = true;
        });
        setTouched(allTouched);

        // If form is invalid, don't submit
        if (!isFormValid) {
            return;
        }

        setIsSubmitting(true);

        const userData = {
            fullname: formData.fullname.trim(),
            mobileNumber: formData.number.trim(),
            password: formData.password
        };

        console.log("Validation Success:", userData);

        try {
            const response = await axios.post('http://skora-backend-v2.vercel.app/principal/register', userData);
            
            if (response.data.msg === true) {
                localStorage.setItem('SKORAPRINsession', formData.number);
                window.location.href = '/dashboard/principal';
            } else {
                alert('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.response?.data?.message || 'Phone number already used. Please try a different number.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div id="register-section-principal-form">
            <div id="register-section-principal-form-title-pane">
                <p id="main-title">
                    <span id="site-name">Skora</span> Principal Portal
                </p>
                <p id="sub-title">Create your official school administrator account</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div id="register-section-principal-form-input-field-container">
                    
                    {/* Full Name Field */}
                    <div className="input-field-wrapper">
                        <label htmlFor="fullname" className="input-label">
                            Full Name <span className="required-asterisk">*</span>
                        </label>
                        <div className={`input-container ${getFieldStatus('fullname')}`}>
                            <input
                                type="text"
                                id="fullname"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="John Doe"
                                aria-label="Full Name"
                                aria-invalid={touched.fullname && errors.fullname ? 'true' : 'false'}
                                aria-describedby={errors.fullname ? 'fullname-error' : undefined}
                            />
                            {getFieldStatus('fullname') === 'success' && (
                                <span className="success-icon" aria-label="Valid">✓</span>
                            )}
                        </div>
                        {touched.fullname && errors.fullname && (
                            <div id="fullname-error" className="error-message" role="alert">
                                {errors.fullname}
                            </div>
                        )}
                    </div>

                    {/* Phone Number Field */}
                    <div className="input-field-wrapper">
                        <label htmlFor="number" className="input-label">
                            Phone Number <span className="required-asterisk">*</span>
                        </label>
                        <div className={`input-container ${getFieldStatus('number')}`}>
                            <input
                                type="tel"
                                id="number"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="+94 771234567"
                                aria-label="Phone Number"
                                aria-invalid={touched.number && errors.number ? 'true' : 'false'}
                            />
                            {getFieldStatus('number') === 'success' && (
                                <span className="success-icon" aria-label="Valid">✓</span>
                            )}
                        </div>
                        {touched.number && errors.number && (
                            <div className="error-message" role="alert">{errors.number}</div>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="input-field-wrapper">
                        <label htmlFor="password" className="input-label">
                            Create Password <span className="required-asterisk">*</span>
                        </label>
                        <div className={`input-container ${getFieldStatus('password')}`}>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Min. 8 characters, letters & numbers"
                                aria-label="Password"
                                aria-invalid={touched.password && errors.password ? 'true' : 'false'}
                            />
                            {getFieldStatus('password') === 'success' && (
                                <span className="success-icon" aria-label="Valid">✓</span>
                            )}
                        </div>
                        {touched.password && errors.password && (
                            <div className="error-message" role="alert">{errors.password}</div>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="input-field-wrapper">
                        <label htmlFor="passwordCon" className="input-label">
                            Confirm Password <span className="required-asterisk">*</span>
                        </label>
                        <div className={`input-container ${getFieldStatus('passwordCon')}`}>
                            <input
                                type="password"
                                id="passwordCon"
                                name="passwordCon"
                                value={formData.passwordCon}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Re-enter password"
                                aria-label="Confirm Password"
                                aria-invalid={touched.passwordCon && errors.passwordCon ? 'true' : 'false'}
                            />
                            {getFieldStatus('passwordCon') === 'success' && (
                                <span className="success-icon" aria-label="Valid">✓</span>
                            )}
                        </div>
                        {touched.passwordCon && errors.passwordCon && (
                            <div className="error-message" role="alert">{errors.passwordCon}</div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="register-btn"
                        disabled={!isFormValid || isSubmitting}
                        aria-busy={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner"></span>
                                Registering...
                            </>
                        ) : (
                            'Register'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PrincipalForm;