import React, { useState } from 'react';
import { loginUser } from '../api';
import { useNavigate} from 'react-router-dom';
import './Login.css'; // Ensure your CSS file is properly imported
import { Form, Button, Alert } from 'react-bootstrap'; // Assuming you're using React Bootstrap

const Login = ({ setAuth }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await loginUser(formData);
      localStorage.setItem('token', response.data.token.access);
      setAuth(true); // Set authentication state to true
      navigate('/profile');
    } catch (error) {
      setMessage('Login failed: Incorrect email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Enter email" 
            required 
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            placeholder="Password" 
            required 
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>

        {message && <Alert variant="danger" className="mt-3">{message}</Alert>}

        {/* <Link to="/forgot-password" className="d-block mt-3">Forgot Password?</Link> */}
      </Form>
    </div>
  );
};

export default Login;
