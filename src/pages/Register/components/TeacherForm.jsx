import React, { useState, useEffect } from 'react';
import './TeacherForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeacherForm = () => {
    const navigate = useNavigate();
  if(localStorage.length>0) {
    navigate('/');
  }
    // Form state management
    const [formData, setFormData] = useState({
        fullname: '',
        idNumber: '',
        salaryNumber: '',
        subject: '',
        address: '',
        email: '',
        mobileNumber: '',
        password: '',
        confirmPassword: ''
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
        idNumber: (value) => {
            if (!value.trim()) return 'NIC number is required';
            if (value.trim().length < 10) return 'NIC must be at least 10 characters';
            if (!/^[0-9]{9}[vVxX]?$|^[0-9]{12}$/.test(value)) return 'Invalid NIC format';
            return '';
        },
        salaryNumber: (value) => {
            if (!value.trim()) return 'Salary number is required';
            if (!/^\d+$/.test(value)) return 'Salary number must contain only digits';
            return '';
        },
        subject: (value) => {
            if (!value.trim()) return 'Subject specialization is required';
            if (value.trim().length < 3) return 'Subject must be at least 3 characters';
            return '';
        },
        address: (value) => {
            if (!value.trim()) return 'Address is required';
            if (value.trim().length < 10) return 'Please enter a complete address (minimum 10 characters)';
            return '';
        },
        email: (value) => {
            if (!value.trim()) return 'Email is required';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'Please enter a valid email address';
            return '';
        },
        mobileNumber: (value) => {
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
        confirmPassword: (value) => {
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

        try {
            const response = await axios.post('http://localhost:3000/teachers/register', {
                fullname: formData.fullname.trim(),
                idNumber: formData.idNumber.trim(),
                salaryNumber: formData.salaryNumber.trim(),
                subject: formData.subject.trim(),
                address: formData.address.trim(),
                email: formData.email.trim(),
                mobileNumber: formData.mobileNumber.trim(),
                password: formData.password
            });

            if (response.data.msg === true) {
                localStorage.setItem('SKORATEAsession', formData.mobileNumber);
                
                window.location.href = '/dashboard/teacher';
            } else {
                alert('Email already exists! Please use a different email.');
            }
        } catch (error) {
            console.error("Registration Error:", error);
            alert(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div id="register-section-teacher-form-main-container">
            <div id="register-form-title">Teacher Basic Information</div>
            <div id="register-form-sub-title">Create a professional profile to manage your classes</div>
            
            <form onSubmit={handleSubmit} noValidate>
                <div className="register-section-student-input-category-container">
                    {/* Full Name */}
                    <div className="register-section-student-form-input-field">
                        <label htmlFor="fullname" className="register-section-student-form-label">
                            Full Name <span className="required-asterisk">*</span>
                        </label>
                        <div className={`register-section-input-element-container ${getFieldStatus('fullname')}`}>
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

                    {/* NIC Number */}
                    <div className="register-section-student-form-input-field">
                        <label htmlFor="idNumber" className="register-section-student-form-label">
                            NIC Number <span className="required-asterisk">*</span>
                        </label>
                        <div className={`register-section-input-element-container ${getFieldStatus('idNumber')}`}>
                            <input
                                type="text"
                                id="idNumber"
                                name="idNumber"
                                value={formData.idNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="199012345678"
                                aria-label="NIC Number"
                                aria-invalid={touched.idNumber && errors.idNumber ? 'true' : 'false'}
                            />
                            {getFieldStatus('idNumber') === 'success' && (
                                <span className="success-icon" aria-label="Valid">✓</span>
                            )}
                        </div>
                        {touched.idNumber && errors.idNumber && (
                            <div className="error-message" role="alert">{errors.idNumber}</div>
                        )}
                    </div>

                    {/* Salary Number */}
                    <div className="register-section-student-form-input-field">
                        <label htmlFor="salaryNumber" className="register-section-student-form-label">
                            Salary Number <span className="required-asterisk">*</span>
                        </label>
                        <div className={`register-section-input-element-container ${getFieldStatus('salaryNumber')}`}>
                            <input
                                type="text"
                                id="salaryNumber"
                                name="salaryNumber"
                                value={formData.salaryNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="123456"
                                aria-label="Salary Number"
                                aria-invalid={touched.salaryNumber && errors.salaryNumber ? 'true' : 'false'}
                            />
                            {getFieldStatus('salaryNumber') === 'success' && (
                                <span className="success-icon" aria-label="Valid">✓</span>
                            )}
                        </div>
                        {touched.salaryNumber && errors.salaryNumber && (
                            <div className="error-message" role="alert">{errors.salaryNumber}</div>
                        )}
                    </div>

                    {/* Subject Specialization */}
                    <div className="register-section-student-form-input-field">
                        <label htmlFor="subject" className="register-section-student-form-label">
                            Subject Specialization <span className="required-asterisk">*</span>
                        </label>
                        <div className={`register-section-input-element-container ${getFieldStatus('subject')}`}>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="e.g., Mathematics"
                                aria-label="Subject Specialization"
                                aria-invalid={touched.subject && errors.subject ? 'true' : 'false'}
                            />
                            {getFieldStatus('subject') === 'success' && (
                                <span className="success-icon" aria-label="Valid">✓</span>
                            )}
                        </div>
                        {touched.subject && errors.subject && (
                            <div className="error-message" role="alert">{errors.subject}</div>
                        )}
                    </div>

                    {/* Residential Address */}
                    <div className="register-section-student-form-input-field">
                        <label htmlFor="address" className="register-section-student-form-label">
                            Residential Address <span className="required-asterisk">*</span>
                        </label>
                        <div className={`register-section-input-element-container ${getFieldStatus('address')}`}>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="123 Academy Way, City"
                                aria-label="Residential Address"
                                aria-invalid={touched.address && errors.address ? 'true' : 'false'}
                            />
                            {getFieldStatus('address') === 'success' && (
                                <span className="success-icon" aria-label="Valid">✓</span>
                            )}
                        </div>
                        {touched.address && errors.address && (
                            <div className="error-message" role="alert">{errors.address}</div>
                        )}
                    </div>

                    {/* Email */}
                    <div className="register-section-student-form-input-field">
                        <label htmlFor="email" className="register-section-student-form-label">
                            Email <span className="required-asterisk">*</span>
                        </label>
                        <div className={`register-section-input-element-container ${getFieldStatus('email')}`}>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="johndoe@example.com"
                                aria-label="Email"
                                aria-invalid={touched.email && errors.email ? 'true' : 'false'}
                            />
                            {getFieldStatus('email') === 'success' && (
                                <span className="success-icon" aria-label="Valid">✓</span>
                            )}
                        </div>
                        {touched.email && errors.email && (
                            <div className="error-message" role="alert">{errors.email}</div>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div className="register-section-student-form-input-field">
                        <label htmlFor="mobileNumber" className="register-section-student-form-label">
                            Phone Number <span className="required-asterisk">*</span>
                        </label>
                        <div className={`register-section-input-element-container ${getFieldStatus('mobileNumber')}`}>
                            <input
                                type="tel"
                                id="mobileNumber"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="+94 771234567"
                                aria-label="Phone Number"
                                aria-invalid={touched.mobileNumber && errors.mobileNumber ? 'true' : 'false'}
                            />
                            {getFieldStatus('mobileNumber') === 'success' && (
                                <span className="success-icon" aria-label="Valid">✓</span>
                            )}
                        </div>
                        {touched.mobileNumber && errors.mobileNumber && (
                            <div className="error-message" role="alert">{errors.mobileNumber}</div>
                        )}
                    </div>

                    {/* Password */}
                    <div className="register-section-student-form-input-field">
                        <label htmlFor="password" className="register-section-student-form-label">
                            Password <span className="required-asterisk">*</span>
                        </label>
                        <div className={`register-section-input-element-container ${getFieldStatus('password')}`}>
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

                    {/* Confirm Password */}
                    <div className="register-section-student-form-input-field">
                        <label htmlFor="confirmPassword" className="register-section-student-form-label">
                            Confirm Password <span className="required-asterisk">*</span>
                        </label>
                        <div className={`register-section-input-element-container ${getFieldStatus('confirmPassword')}`}>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Re-enter password"
                                aria-label="Confirm Password"
                                aria-invalid={touched.confirmPassword && errors.confirmPassword ? 'true' : 'false'}
                            />
                            {getFieldStatus('confirmPassword') === 'success' && (
                                <span className="success-icon" aria-label="Valid">✓</span>
                            )}
                        </div>
                        {touched.confirmPassword && errors.confirmPassword && (
                            <div className="error-message" role="alert">{errors.confirmPassword}</div>
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

export default TeacherForm;