import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'
import { useNavigate } from 'react-router-dom'; 

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    password2: '',
    tc: false,
  });

  const { email, name, password, password2, tc } = formData;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/user/register/', formData);
      console.log(res.data);
      navigate('/login')
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" value={email} onChange={handleChange} placeholder="Email" required />
      <input type="text" name="name" value={name} onChange={handleChange} placeholder="Name" required />
      <input type="password" name="password" value={password} onChange={handleChange} placeholder="Password" required />
      <input type="password" name="password2" value={password2} onChange={handleChange} placeholder="Confirm Password" required />
      <label>
        <input type="checkbox" name="tc" checked={tc} onChange={handleChange} required />
        I agree to the terms and conditions
      </label>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
