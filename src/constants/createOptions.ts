import routes from './routes';
import { Role } from '../store/enums';

export const createOptions = [
  {
    name: 'Incident',
    uri: routes.platform.createIncident,
  },
  {
    name: 'Asset',
    uri: routes.platform.createAsset,
  },
  {
    name: 'User',
    uri: routes.platform.inviteUser,
    access: [Role.ADMIN, Role.MANAGER],
  },
];
