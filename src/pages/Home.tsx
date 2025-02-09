import React, { useContext } from 'react';
import { AxisContext } from '../store/AxisContext';
import { AccountContext } from '../store/AccountContext';
import { NoAccounts } from '../components/no-accounts/NoAccounts';

export const Home: React.FC = () => {
  const { user } = useContext(AxisContext);
  const { selectedAccount } = useContext(AccountContext);

  return selectedAccount ? <div>Home</div> : <NoAccounts />;
};
