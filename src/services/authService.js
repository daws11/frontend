import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { BASE_URL } from '../config';

const API_URL = `${BASE_URL}/api/auth`;

const register = (formData) => {
  return axios.post(`${API_URL}/register`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw new Error('Failed to login');
  }
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  if (!user) {
    return null;
  }
  try {
    return JSON.parse(user);
  } catch (error) {
    return null;
  }
};

const getDecodedToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return jwtDecode(token);
  }
  return null;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getDecodedToken
};

export default authService;