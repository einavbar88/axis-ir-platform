import routes from './routes';

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
  },
];
