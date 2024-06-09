import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/user';  

export const registerUser = (userData) => {
  return axios.post(`${API_URL}/register/`, userData);
};

export const loginUser = (userData) => {
  return axios.post(`${API_URL}/login/`, userData);
};

export const getUserProfile = (token) => {
  return axios.get(`${API_URL}/profile/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const changePassword = (token, passwordData) => {
  return axios.post(`${API_URL}/change-password/`, passwordData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const sendPasswordResetEmail = (email) => {
  return axios.post(`${API_URL}/send-reset-password-email/`, { email });
};

export const resetPassword = (uid, token, passwordData) => {
  return axios.post(`${API_URL}/reset/${uid}/${token}/`, passwordData);
};
