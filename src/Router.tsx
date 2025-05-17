import React, { useContext, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AxisContext } from './store/AxisContext';
import { AccountProvider } from './store/AccountContext';
import { TopBar } from './components/top-bar/TopBar';
import { Navigation } from './components/navigator/Navigation';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Loader } from './components/ui/Loader';
import { CreateAccount } from './pages/account/CreateAccount';
import routes from './constants/routes';
import { ManageAccount } from './pages/account/ManageAccount';
import { Accounts } from './pages/account/Accounts';
import { CreateAsset } from './pages/assets/CreateAsset';
import { Assets } from './pages/assets/Assets';
import { ManageAsset } from './pages/assets/ManageAsset';
import { InviteUser } from './pages/users/InviteUser';
import { EditAccount } from './pages/account/EditAccount';
import { CreateAssetGroup } from './pages/assets/asset-groups/CreateAssetGroup';
import { AssetGroups } from './pages/assets/asset-groups/AssetGroups';
import { ManageAssetGroup } from './pages/assets/asset-groups/ManageAssetGroup';
import { Users } from './pages/users/Users';
import { CreateIncident } from './pages/incidents/CreateIncident';
import { Incident } from './pages/incidents/Incident';
import { Incidents } from './pages/incidents/Incidents';
import { Task } from './pages/incidents/Task';

export const Router: React.FC = () => {
  const { isLoggedIn, isPageLoading, modals } = useContext(AxisContext);

  const location = useLocation();

  useEffect(() => {
    Object.values(modals).forEach((modal) => {
      if (location.search.includes(`${modal.param}=true`) && !modal.isOpen) {
        modal.setIsOpen(true);
      }

      if (!location.search.includes(`${modal.param}=true`) && modal.isOpen) {
        modal.setIsOpen(true);
      }
    });
  }, [location]);

  if (isPageLoading) {
    return (
      <div className='h-screen bg-main-darkest flex items-center justify-center'>
        <Loader size={200} />
      </div>
    );
  }

  return isLoggedIn ? (
    <>
      <AccountProvider>
        <TopBar />
        <Navigation />
        <div className={'ml-52 mt-20 p-2 font-poppins'}>
          <Routes>
            <Route path={routes.platform.home} element={<Home />} />
            <Route path={routes.platform.accounts} element={<Accounts />} />
            <Route
              path={routes.platform.createAccount}
              element={<CreateAccount />}
            />
            <Route
              path={routes.platform.editAccount}
              element={<EditAccount />}
            />
            <Route
              path={routes.platform.manageAccount}
              element={<ManageAccount />}
            />
            <Route path={routes.platform.users} element={<Users />} />
            <Route
              path={routes.platform.createAsset}
              element={<CreateAsset />}
            />
            <Route
              path={routes.platform.manageAsset}
              element={<ManageAsset />}
            />
            <Route
              path={routes.platform.createIncident}
              element={<CreateIncident />}
            />
            <Route path={routes.platform.incident} element={<Incident />} />
            <Route path={routes.platform.incidents} element={<Incidents />} />
            <Route path={routes.platform.task} element={<Task />} />
            <Route
              path={routes.platform.assetGroups}
              element={<AssetGroups />}
            />
            <Route
              path={routes.platform.createAssetGroup}
              element={<CreateAssetGroup />}
            />
            <Route
              path={routes.platform.manageAsset}
              element={<ManageAssetGroup />}
            />
            <Route path={routes.platform.assets} element={<Assets />} />
            <Route
              path={routes.platform.notFound}
              element={
                <div className='w-full h-full flex flex-col justify-center'>
                  <h1 className='text-center text-main-darkest font-bold text-4xl'>
                    Page not found
                  </h1>
                  <img
                    style={{ maxHeight: 'calc(100vh - 200px)' }}
                    src={routes.assets.notFound}
                    alt={'Page not found'}
                  />
                </div>
              }
            />
          </Routes>
        </div>
        {modals.createAssetGroup.isOpen && <CreateAssetGroup />}
        {modals.inviteUser.isOpen && <InviteUser />}
      </AccountProvider>
    </>
  ) : (
    <Login />
  );
};
