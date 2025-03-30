const platform = {
  home: '/',
  about: '/about',
  accounts: '/accounts',
  createAccount: '/create-account',
  manageAccount: '/manage-account/:id',
  assets: '/assets',
  createAsset: '/create-asset',
  manageAsset: '/manage-asset/:id',
  inviteUser: '/invite-user',
  createIncident: '/create-incident',
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
  },
  accounts: {
    create: 'accounts/create',
    getByUserId: 'accounts/getByUserId',
    getById: 'accounts/getById',
  },
  assets: {
    create: 'assets/create',
    update: 'assets/update',
    getAssetsByAssetGroup: 'assets/getAssetsByAssetGroup',
    getAssetsByCompanyId: 'assets/getAssetsByCompanyId',
    getById: 'assets/getById',
  },
};

const ASSETS_PATH = 'http://localhost:3000';

const assets = {
  logo: `${ASSETS_PATH}/AxisIR.png`,
  notFound: `${ASSETS_PATH}/imgs/404.svg`,
  createAccount: `${ASSETS_PATH}/imgs/createAccount.svg`,
  createAsset: `${ASSETS_PATH}/imgs/createAsset.svg`,
  noAccount: `${ASSETS_PATH}/imgs/noAccount.svg`,
  signup: `${ASSETS_PATH}/imgs/signup.png`,
  user: `${ASSETS_PATH}/imgs/user.svg`,
  manage: `${ASSETS_PATH}/imgs/manage.svg`,
  chevron: `${ASSETS_PATH}/icons/chevron.svg`,
};

const routes = { platform, api: server, assets };
export default routes;
