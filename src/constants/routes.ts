const platform = {
  home: '/',
  about: '/about',
  createAccount: '/create-account',
  manageAccount: '/manage-account/:id',
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
  },
};

const ASSETS_PATH = 'http://localhost:3000';

const assets = {
  logo: `${ASSETS_PATH}/AxisIR.png`,
  notFound: `${ASSETS_PATH}/imgs/404.svg`,
  createAccount: `${ASSETS_PATH}/imgs/createAccount.svg`,
  noAccount: `${ASSETS_PATH}/imgs/noAccount.svg`,
  signup: `${ASSETS_PATH}/imgs/signup.svg`,
  user: `${ASSETS_PATH}/imgs/user.svg`,
  manage: `${ASSETS_PATH}/imgs/manage.svg`,
  chevron: `${ASSETS_PATH}/icons/chevron.svg`,
};

const routes = { platform, api: server, assets };
export default routes;
