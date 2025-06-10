import axios, { type AxiosRequestConfig } from 'axios';
import type { Indicator } from '../pages/incidents/types';
import routes from '../constants/routes';

const indicators = (config: AxiosRequestConfig) => ({
  create: async (indicator: Indicator) =>
    axios.post(routes.api.indicators.create, { ...indicator }, config),
  update: async (indicator: Indicator) =>
    axios.post(routes.api.indicators.update, { ...indicator }, config),
  delete: async (id: number) =>
    axios.delete(`${routes.api.indicators.deleteIndicator}${id}`, config),
});

export default indicators;
