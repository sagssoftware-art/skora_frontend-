import React, { useState, useEffect } from 'react';
import './StudentsForm.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentsForm = () => {
  const navigate = useNavigate();
  if(localStorage.length>0) {
    navigate('/');
  }
  const [formData, setFormData] = useState({
    fullname: '',
    birthday: '',
    address: '',
    grade: '',
    email: '',
    number: '',
    username: '',
    password: '',
    passwordCon: '',
    mother: '',
    motherNIC: '',
    father: '',
    fatherNIC: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullname':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 3) {
          error = 'Full name must be at least 3 characters';
        }
        break;
      case 'birthday':
        if (!value) {
          error = 'Birthday is required';
        } else {
          const age = new Date().getFullYear() - new Date(value).getFullYear();
          if (age < 5 || age > 25) {
            error = 'Age must be between 5 and 25 years';
          }
        }
        break;
      case 'address':
        if (!value.trim()) {
          error = 'Address is required';
        } else if (value.trim().length < 10) {
          error = 'Please enter a complete address';
        }
        break;
      case 'grade':
        if (!value) {
          error = 'Grade is required';
        } else if (value < 1 || value > 13) {
          error = 'Grade must be between 1 and 13';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error = 'Please enter a valid email address';
          }
        }
        break;
      case 'number':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else {
          const phoneRegex = /^[0-9]{10}$/;
          if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            error = 'Phone number must be exactly 10 digits';
          }
        }
        break;
      case 'username':
        if (!value.trim()) {
          error = 'Username is required';
        } else if (value.trim().length < 4) {
          error = 'Username must be at least 4 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = 'Username can only contain letters, numbers, and underscores';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(value)) {
          error = 'Password must contain both letters and numbers';
        }
        break;
      case 'passwordCon':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
      case 'mother':
        if (!value.trim()) {
          error = "Mother's name is required";
        } else if (value.trim().length < 3) {
          error = 'Name must be at least 3 characters';
        }
        break;
      case 'motherNIC':
        if (!value.trim()) {
          error = "Mother's NIC is required";
        } else {
          const nicRegex = /^([0-9]{9}[xXvV]|[0-9]{12})$/;
          if (!nicRegex.test(value)) {
            error = 'Invalid NIC format (9 digits + X/V or 12 digits)';
          }
        }
        break;
      case 'father':
        if (!value.trim()) {
          error = "Father's name is required";
        } else if (value.trim().length < 3) {
          error = 'Name must be at least 3 characters';
        }
        break;
      case 'fatherNIC':
        if (!value.trim()) {
          error = "Father's NIC is required";
        } else {
          const nicRegex = /^([0-9]{9}[xXvV]|[0-9]{12})$/;
          if (!nicRegex.test(value)) {
            error = 'Invalid NIC format (9 digits + X/V or 12 digits)';
          }
        }
        break;
      default:
        break;
    }
    return error;
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    if (touched[id]) {
      const error = validateField(id, value);
      setErrors(prev => ({
        ...prev,
        [id]: error
      }));
    }
  };
  const handleBlur = (e) => {
    const { id, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [id]: true
    }));

    const error = validateField(id, value);
    setErrors(prev => ({
      ...prev,
      [id]: error
    }));
  };
  useEffect(() => {
    const hasErrors = Object.values(errors).some(error => error !== '');
    const allFieldsFilled = Object.values(formData).every(value => value.toString().trim() !== '');
    
    setIsFormValid(!hasErrors && allFieldsFilled);
  }, [errors, formData]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      alert('Please fix all errors before submitting');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/students/register', formData);
      if (response.data.msg) {
        localStorage.setItem('SKORASTUsession', formData.number);
        window.location.href = '/dashboard/student';
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Username already taken or server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClass = (fieldName) => {
    if (!touched[fieldName]) return '';
    return errors[fieldName] ? 'input-error' : 'input-valid';
  };

  return (
    <div id="student-register-form">
      <form onSubmit={handleSubmit}>
        <div className="register-section-student-input-form-catagory">
          <div className="register-section-student-input-form-catagory-title">
            Personal Details
          </div>
          
          <div className="register-section-student-input-catagory-container">

            <div className="register-section-student-form-input-field">
              <label htmlFor="fullname" className="register-section-student-form-label">
                Full Name: <span className="required-asterisk">*</span>
              </label>
              <div className="register-section-input-element-container">
                <input
                  type="text"
                  id="fullname"
                  placeholder="John Doe"
                  value={formData.fullname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('fullname')}
                  aria-label="Full Name"
                  aria-invalid={touched.fullname && errors.fullname ? 'true' : 'false'}
                />
                {touched.fullname && !errors.fullname && formData.fullname && (
                  <span className="validation-icon success">✓</span>
                )}
              </div>
              {touched.fullname && errors.fullname && (
                <div className="error-message">{errors.fullname}</div>
              )}
            </div>

            <div className="register-section-student-form-input-field">
              <label htmlFor="birthday" className="register-section-student-form-label">
                Birthday: <span className="required-asterisk">*</span>
              </label>
              <div className="register-section-input-element-container">
                <input
                  type="date"
                  id="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('birthday')}
                  aria-label="Birthday"
                  aria-invalid={touched.birthday && errors.birthday ? 'true' : 'false'}
                />
                {touched.birthday && !errors.birthday && formData.birthday && (
                  <span className="validation-icon success">✓</span>
                )}
              </div>
              {touched.birthday && errors.birthday && (
                <div className="error-message">{errors.birthday}</div>
              )}
            </div>
            
            <div className="register-section-student-form-input-field">
              <label htmlFor="address" className="register-section-student-form-label">
                Address: <span className="required-asterisk">*</span>
              </label>
              <div className="register-section-input-element-container">
                <input
                  type="text"
                  id="address"
                  placeholder="123 Street, City"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('address')}
                  aria-label="Address"
                  aria-invalid={touched.address && errors.address ? 'true' : 'false'}
                />
                {touched.address && !errors.address && formData.address && (
                  <span className="validation-icon success">✓</span>
                )}
              </div>
              {touched.address && errors.address && (
                <div className="error-message">{errors.address}</div>
              )}
            </div>
            
            <div className="register-section-student-form-input-field">
              <label htmlFor="grade" className="register-section-student-form-label">
                Current Study Grade: <span className="required-asterisk">*</span>
              </label>
              <div className="register-section-input-element-container">
                <input
                  type="number"
                  id="grade"
                  placeholder="1-13"
                  min="1"
                  max="13"
                  value={formData.grade}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('grade')}
                  aria-label="Current Study Grade"
                  aria-invalid={touched.grade && errors.grade ? 'true' : 'false'}
                />
                {touched.grade && !errors.grade && formData.grade && (
                  <span className="validation-icon success">✓</span>
                )}
              </div>
              {touched.grade && errors.grade && (
                <div className="error-message">{errors.grade}</div>
              )}
            </div>
            
            <div className="register-section-student-form-input-field">
              <label htmlFor="email" className="register-section-student-form-label">
                Email: <span className="required-asterisk">*</span>
              </label>
              <div className="register-section-input-element-container">
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('email')}
                  aria-label="Email Address"
                  aria-invalid={touched.email && errors.email ? 'true' : 'false'}
                />
                {touched.email && !errors.email && formData.email && (
                  <span className="validation-icon success">✓</span>
                )}
              </div>
              {touched.email && errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>
            
            <div className="register-section-student-form-input-field">
              <label htmlFor="number" className="register-section-student-form-label">
                Phone Number: <span className="required-asterisk">*</span>
              </label>
              <div className="register-section-input-element-container">
                <input
                  type="tel"
                  id="number"
                  placeholder="0712345678"
                  value={formData.number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('number')}
                  aria-label="Phone Number"
                  aria-invalid={touched.number && errors.number ? 'true' : 'false'}
                />
                {touched.number && !errors.number && formData.number && (
                  <span className="validation-icon success">✓</span>
                )}
              </div>
              {touched.number && errors.number && (
                <div className="error-message">{errors.number}</div>
              )}
            </div>


            <div className="register-section-student-form-input-field">
              <label htmlFor="username" className="register-section-student-form-label">
                Create Username: <span className="required-asterisk">*</span>
              </label>
              <div className="register-section-input-element-container">
                <input
                  type="text"
                  id="username"
                  placeholder="johndoe88"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('username')}
                  aria-label="Username"
                  aria-invalid={touched.username && errors.username ? 'true' : 'false'}
                />
                {touched.username && !errors.username && formData.username && (
                  <span className="validation-icon success">✓</span>
                )}
              </div>
              {touched.username && errors.username && (
                <div className="error-message">{errors.username}</div>
              )}
            </div>
            
            <div className="register-section-student-form-input-field">
              <label htmlFor="password" className="register-section-student-form-label">
                Create Password: <span className="required-asterisk">*</span>
              </label>
              <div className="register-section-input-element-container">
                <input
                  type="password"
                  id="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('password')}
                  aria-label="Password"
                  aria-invalid={touched.password && errors.password ? 'true' : 'false'}
                />
                {touched.password && !errors.password && formData.password && (
                  <span className="validation-icon success">✓</span>
                )}
              </div>
              {touched.password && errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
              {!errors.password && formData.password && (
                <div className="helper-text">Password must be 6+ characters with letters and numbers</div>
              )}
            </div>
            
            <div className="register-section-student-form-input-field">
              <label htmlFor="passwordCon" className="register-section-student-form-label">
                Confirm Password: <span className="required-asterisk">*</span>
              </label>
              <div className="register-section-input-element-container">
                <input
                  type="password"
                  id="passwordCon"
                  placeholder="********"
                  value={formData.passwordCon}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('passwordCon')}
                  aria-label="Confirm Password"
                  aria-invalid={touched.passwordCon && errors.passwordCon ? 'true' : 'false'}
                />
                {touched.passwordCon && !errors.passwordCon && formData.passwordCon && (
                  <span className="validation-icon success">✓</span>
                )}
              </div>
              {touched.passwordCon && errors.passwordCon && (
                <div className="error-message">{errors.passwordCon}</div>
              )}
            </div>
          </div>

          <div className="section-divider"></div>

          <div className="register-section-student-input-form-catagory-title">
            Parent Information
          </div>

          <div className="register-section-student-input-catagory-container">
            
            <div className="register-section-student-form-input-field">
              <label htmlFor="mother" className="register-section-student-form-label">
                Mother's Name: <span className="required-asterisk">*</span>
              </label>
              <div className="register-section-input-element-container">
                <input
                  type="text"
                  id="mother"
                  placeholder="Jane Doe"
                  value={formData.mother}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('mother')}
                  aria-label="Mother's Name"
                  aria-invalid={touched.mother && errors.mother ? 'true' : 'false'}
                />
                {touched.mother && !errors.mother && formData.mother && (
                  <span className="validation-icon success">✓</span>
                )}
              </div>
              {touched.mother && errors.mother && (
                <div className="error-message">{errors.mother}</div>
              )}
            </div>
            
            <div className="register-section-student-form-input-field">
              <label htmlFor="motherNIC" className="register-section-student-form-label">
                Mother's NIC: <span className="required-asterisk">*</span>
              </label>
              <div className="register-section-input-element-container">
                <input
                  type="text"
                  id="motherNIC"
                  placeholder="123456789V or 200012345678"
                  value={formData.motherNIC}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('motherNIC')}
                  aria-label="Mother's NIC"
                  aria-invalid={touched.motherNIC && errors.motherNIC ? 'true' : 'false'}
                />
                {touched.motherNIC && !errors.motherNIC && formData.motherNIC && (
                  <span className="validation-icon success">✓</span>
                )}
              </div>
              {touched.motherNIC && errors.motherNIC && (
                <div className="error-message">{errors.motherNIC}</div>
              )}
            </div>
            
            <div className="register-section-student-form-input-field">
              <label htmlFor="father" className="register-section-student-form-label">
                Father's Name: <span className="required-asterisk">*</span>
              </label>
              <div className="register-section-input-element-container">
                <input
                  type="text"
                  id="father"
                  placeholder="John Doe Sr."
                  value={formData.father}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('father')}
                  aria-label="Father's Name"
                  aria-invalid={touched.father && errors.father ? 'true' : 'false'}
                />
                {touched.father && !errors.father && formData.father && (
                  <span className="validation-icon success">✓</span>
                )}
              </div>
              {touched.father && errors.father && (
                <div className="error-message">{errors.father}</div>
              )}
            </div>
            
            <div className="register-section-student-form-input-field">
              <label htmlFor="fatherNIC" className="register-section-student-form-label">
                Father's NIC: <span className="required-asterisk">*</span>
              </label>
              <div className="register-section-input-element-container">
                <input
                  type="text"
                  id="fatherNIC"
                  placeholder="123456789V or 200012345678"
                  value={formData.fatherNIC}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClass('fatherNIC')}
                  aria-label="Father's NIC"
                  aria-invalid={touched.fatherNIC && errors.fatherNIC ? 'true' : 'false'}
                />
                {touched.fatherNIC && !errors.fatherNIC && formData.fatherNIC && (
                  <span className="validation-icon success">✓</span>
                )}
              </div>
              {touched.fatherNIC && errors.fatherNIC && (
                <div className="error-message">{errors.fatherNIC}</div>
              )}
            </div>
          </div>

          <button
            type="submit"
            id="register-section-student-form-submit-btn"
            disabled={!isFormValid || isLoading}
            className={!isFormValid || isLoading ? 'disabled' : ''}
          >
            {isLoading ? (
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

export default StudentsForm;