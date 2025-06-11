const platform = {
  home: '/',
  about: '/about',
  accounts: '/accounts',
  createAccount: '/create-account',
  manageAccount: '/manage-account/:id',
  editAccount: '/edit-account/:id',
  assets: '/assets',
  assetPage: '/asset/:id',
  assetGroupPage: '/asset-group/:id',
  createAsset: '/create-asset',
  manageAsset: '/manage-asset/:id',
  assetGroups: '/asset-groups',
  createAssetGroup: '?create-asset-group=true',
  inviteUser: '?invite-user=true',
  users: '/users',
  incidents: '/incidents',
  createIncident: '/create-incident',
  incident: '/incident/:id',
  task: '/task/:id',
  login: '/login',
  register: '/register',
  profile: '/profile',
  notFound: '*',
};

const server = {
  users: {
    signup: 'users/signup',
    login: 'users/login',
    tokenLogin: 'users/tokenLogin',
    logout: 'users/logout',
    getRoles: 'users/getRoles/all',
    getByCompanyId: 'users/getByCompanyId/:companyId',
    inviteUser: 'users/inviteUser/:companyId',
    changeRole: 'users/changeRole/:companyId',
  },
  accounts: {
    create: 'accounts/create',
    getByUserId: 'accounts/getByUserId',
    getById: 'accounts/getById',
  },
  assets: {
    create: 'assets/create',
    createAssetGroup: 'assets/createAssetGroup',
    assignAssetToGroup: 'assignAssetToGroup',
    update: 'assets/update',
    getAssetsByAssetGroup: 'assets/getAssetsByAssetGroup',
    getAssetsByCompanyId: 'assets/getAssetsByCompanyId',
    getById: 'assets/getById',
    getAssetGroups: 'assets/getAssetGroups',
    getAssetGroup: 'assets/getAssetGroup',
    getIoc: 'assets/getIoc',
    getAssetGroupIoc: 'assets/getAssetGroupIoc',
  },
  incidents: {
    getIoc: 'incidents/getIoc',
    create: 'incidents/create',
    getByCompanyId: 'incidents/getByCompanyId',
    getById: 'incidents/getById',
    update: 'incidents/update',
    generateReport: 'incidents/generateReport',
  },
  tasks: {
    create: 'tasks/create',
    getByIncidentId: 'tasks/getByIncidentId',
    getAllTasks: 'tasks/getAllTasks',
    getById: 'tasks/getById',
    update: 'tasks/update',
  },
  indicators: {
    create: 'indicators/create',
    deleteIndicator: 'indicators/',
    update: 'indicators/create',
  },
};

const ASSETS_PATH = 'http://localhost:3000';

const assets = {
  logo: `${ASSETS_PATH}/AxisIR.png`,
  notFound: `${ASSETS_PATH}/imgs/404.svg`,
  createAccount: `${ASSETS_PATH}/imgs/createAccount.svg`,
  createAsset: `${ASSETS_PATH}/imgs/createAsset.svg`,
  noAccounts: `${ASSETS_PATH}/imgs/noAccounts.svg`,
  signup: `${ASSETS_PATH}/imgs/signup.png`,
  user: `${ASSETS_PATH}/imgs/user.svg`,
  manage: `${ASSETS_PATH}/imgs/manage.svg`,
  incident: `${ASSETS_PATH}/imgs/incident.svg`,
  chevron: `${ASSETS_PATH}/icons/chevron.svg`,
};

const routes = { platform, api: server, assets };
export default routes;
