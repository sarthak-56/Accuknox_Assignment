import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Welcome to Our Social Network Website</h2>
      <p style={styles.paragraph}>
        Welcome to our registration page! Registering with us allows you to access exclusive features and content.
        Please fill out the form below to create your account. Once registered, you can log in to your account
        to manage your profile, access personalized content, and much more. Thank you for joining us!
      </p>
      <Link to="/login" style={styles.link}>Login</Link>
      <p style={styles.paragraph}>
        Welcome back! Please log in to access your account. If you don't have an account yet, you can register here.
        Logging in allows you to access personalized content, manage your profile, and more. If you've forgotten
        your password, you can reset it here. Thank you for being a part of our community!
      </p>
      <Link to="/register" style={styles.link}>Register</Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '50px', // Adjust margin as needed
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  paragraph: {
    marginBottom: '20px',
    textAlign: 'center',
    lineHeight: '1.5',
    color: '#555',
  },
  link: {
    display: 'inline-block',
    padding: '10px 20px',
    marginBottom: '10px',
    color: '#007bff',
    textDecoration: 'none',
    border: '1px solid #007bff',
    borderRadius: '5px',
    transition: 'background-color 0.3s, color 0.3s',
  },
  linkHover: {
    backgroundColor: '#007bff',
    color: 'white',
  },
};

export default Home;
