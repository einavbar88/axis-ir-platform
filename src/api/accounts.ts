import axios, { type AxiosRequestConfig } from 'axios';
import type { CreateAccountForm } from '../pages/account/CreateAccount';
import routes from '../constants/routes';

const accounts = (config: AxiosRequestConfig) => ({
  create: async (createForm: CreateAccountForm) =>
    axios.post(routes.api.accounts.create, { ...createForm }, config),
  getByUserId: async () => axios.get(routes.api.accounts.getByUserId, config),
});

export default accounts;
