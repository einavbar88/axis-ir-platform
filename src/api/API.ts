import axios from 'axios';
import type { SignupFormFields } from '../components/login/SignupForm';

const baseURL = 'http://localhost:8080/';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const users = {
  signup: async (signupForm: SignupFormFields) =>
    axiosInstance.post('users/signup', { ...signupForm }),

  login: async (username: string, password: string) =>
    axiosInstance.post('users/login', { username, password }),

  loginToken: async (token: string) =>
    axiosInstance.post('users/tokenLogin', { token }),

  logout: async () => axiosInstance.post('users/logout'),
};

export const API = {
  users,
};
