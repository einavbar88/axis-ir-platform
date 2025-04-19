import routes from './routes';
import { Role } from '../store/enums';

export type CreateOption = { name: string; uri: string; access?: number[] };
export const createOptions: CreateOption[] = [
  {
    name: 'Incident',
    uri: routes.platform.createIncident,
  },
  {
    name: 'Asset',
    uri: routes.platform.createAsset,
  },
  {
    name: 'Asset Group',
    uri: routes.platform.createAssetGroup,
  },
  {
    name: 'Invite user',
    uri: routes.platform.inviteUser,
    access: [Role.ADMIN, Role.MANAGER],
  },
];
