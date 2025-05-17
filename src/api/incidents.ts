import axios, { type AxiosRequestConfig } from 'axios';
import type { Incident } from '../pages/incidents/types';
import routes from '../constants/routes';

const incidents = (config: AxiosRequestConfig) => ({
  create: async (createForm: Incident) =>
    axios.post(routes.api.incidents.create, { ...createForm }, config),
  update: async (createForm: Incident) =>
    axios.post(routes.api.incidents.update, { ...createForm }, config),
  getIncidents: async (companyId: string) =>
    axios.get(`${routes.api.incidents.getByCompanyId}/${companyId}`, config),
  getById: async (id: number) =>
    axios.get(`${routes.api.incidents.getById}/${id}`, config),
});

export default incidents;
