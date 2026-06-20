import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../ReduxToolkit/AuthSlice';
import './login.css';
import { API_URLS } from '../config';
import Swal from "sweetalert2"
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'ADMIN',
  });
  console.log(formData)
  const [errors, setErrors] = useState({ email: '', password: '', auth: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value)

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'Email Id is required';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '', auth: '' });
    if (validateForm()) {
      try {
        const response = await axios.post(API_URLS.validateAccount, {
          email: formData.email,
          password: formData.password,
          role: formData.role
        });

        const token = response.data.message;
        const { email } = formData;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('email', email);
        dispatch(login());
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'You have been logged in successfully!',
          showConfirmButton: false,
          timer: 2000,
        });
        navigate('/dashboard');
      } catch (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          auth: 'Invalid email or password',
        }));
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid email or password. Please try again.',
        });
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card h-100 border">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email ID</label>
            <input
              type="text"
              className={`form-control ${errors.email ? 'error-highlight' : ''}`}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'error-highlight' : ''}`}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <button type="submit" className="login-button">Login</button>
          {/* {errors.auth && <div className="error-message">{errors.auth}</div>} */}
        </form>
      </div>
    </div>
  );
};

export default Login;
