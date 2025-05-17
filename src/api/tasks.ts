import axios, { type AxiosRequestConfig } from 'axios';
import type { Task } from '../pages/incidents/types';
import routes from '../constants/routes';

const tasks = (config: AxiosRequestConfig) => ({
  create: async (createForm: Task) =>
    axios.post(routes.api.tasks.create, { ...createForm }, config),
  update: async (createForm: Partial<Task>) =>
    axios.post(routes.api.tasks.update, { ...createForm }, config),
  getTasks: async (incidentId: number) =>
    axios.get(`${routes.api.tasks.getByIncidentId}/${incidentId}`, config),
  getAllTasks: async (incidentIds?: number[]) =>
    axios.post(routes.api.tasks.getAllTasks, { incidentIds }, config),
  getById: async (id: number) =>
    axios.get(`${routes.api.tasks.getById}/${id}`, config),
});

export default tasks;
