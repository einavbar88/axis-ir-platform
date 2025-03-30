import axios, { type AxiosRequestConfig } from 'axios';
import type { CreateAssetForm } from '../pages/assets/CreateAsset';
import routes from '../constants/routes';

const assets = (config: AxiosRequestConfig) => ({
  create: async (createForm: CreateAssetForm) =>
    axios.post(routes.api.assets.create, { ...createForm }, config),
  update: async (createForm: CreateAssetForm) =>
    axios.post(routes.api.assets.update, { ...createForm }, config),
  getAssets: async (companyId: string) =>
    axios.get(`${routes.api.assets.getAssetsByCompanyId}/${companyId}`, config),
  getById: async (id: number) =>
    axios.get(`${routes.api.assets.getById}/${id}`, config),
});

export default assets;
