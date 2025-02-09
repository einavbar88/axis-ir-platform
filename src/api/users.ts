import axios, { type AxiosRequestConfig } from 'axios';
import type { SignupFormFields } from '../components/login/SignupForm';
import routes from '../constants/routes';

const users = (config: AxiosRequestConfig) => {
  return {
    signup: async (signupForm: SignupFormFields) =>
      axios.post(routes.api.users.signup, { ...signupForm }, config),

    login: async (username: string, password: string) =>
      axios.post(routes.api.users.login, { username, password }, config),

    loginToken: async (token: string) =>
      axios.post(routes.api.users.tokenLogin, { token }, config),

    logout: async () => axios.post(routes.api.users.logout, {}, config),
  };
};

export default users;
