import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';

export const NoAccounts: React.FC = () => {
  return (
    <div className='w-full mt-20 flex flex-col items-center justify-center '>
      <h1>You have no accounts</h1>
      <p className='my-5'>
        <Link
          to={routes.platform.createAccount}
          className='text-main-dark font-bold'
        >
          Click here{' '}
        </Link>{' '}
        to add a new account
      </p>
      <img alt={'No Accounts'} src={routes.assets.noAccount} />
    </div>
  );
};
