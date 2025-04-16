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

    logout: async (token: string | null) => {
      if (token) return axios.post(routes.api.users.logout, { token }, config);
    },

    getRoles: async () => {
      return axios.get(routes.api.users.getRoles, config);
    },

    invite: async (email: string, role: number, accountId: string) => {
      return axios.post(
        routes.api.users.inviteUser.replace(':companyId', accountId),
        {
          email,
          role,
        },
        config,
      );
    },
  };
};

export default users;
