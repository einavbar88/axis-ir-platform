import axios, { type AxiosRequestConfig } from 'axios';
import type {
  CreateAssetForm,
  CreateAssetGroupForm,
} from '../pages/assets/types';
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
  createAssetGroup: async (createForm: CreateAssetGroupForm) =>
    axios.post(routes.api.assets.createAssetGroup, createForm, config),
});

export default assets;
