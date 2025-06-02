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
  getAssetsByAssetGroup: async (groupId: string) =>
    axios.get(`${routes.api.assets.getAssetsByAssetGroup}/${groupId}`, config),
  getById: async (id: number) =>
    axios.get(`${routes.api.assets.getById}/${id}`, config),
  getAssetGroups: async (companyId: string) =>
    axios.get(`${routes.api.assets.getAssetGroups}/${companyId}`, config),
  getAssetGroup: async (id: number) =>
    axios.get(`${routes.api.assets.getAssetGroup}/${id}`, config),
  createAssetGroup: async (createForm: CreateAssetGroupForm) =>
    axios.post(routes.api.assets.createAssetGroup, createForm, config),
  assignAssetToGroup: async (
    assetGroupId: number,
    assetId: number,
    isRemove?: boolean,
  ) =>
    axios.post(
      routes.api.assets.assignAssetToGroup,
      { assetGroupId, assetId, isRemove },
      config,
    ),
  getIocForAssets: async (assetId: string, timeFrame: string) =>
    axios.get(
      `${routes.api.assets.getIoc}/${assetId}?timeFrame=${timeFrame}`,
      config,
    ),
  getIocForAssetGroup: async (assetGroupId: string, timeFrame: string) =>
    axios.get(
      `${routes.api.assets.getAssetGroupIoc}/${assetGroupId}?timeFrame=${timeFrame}`,
      config,
    ),
});

export default assets;
