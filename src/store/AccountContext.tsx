import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { AxisContext } from './AxisContext';

export type Option = {
  label: string;
  value: string;
};

interface AccountContextType {
  setSelectedAccount: (value: Option) => void;
  selectedAccount: Option;
  accounts: Option[];
}

export const AccountContext = createContext<AccountContextType>(
  {} as AccountContextType,
);

interface AccountProviderProps {
  children: ReactNode;
}

export const AccountProvider: React.FC<AccountProviderProps> = ({
  children,
}) => {
  const { accounts: dbAccounts } = useContext(AxisContext);

  const accounts = dbAccounts.map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const [selectedAccount, setSelectedAccount] = useState<Option>(accounts[0]);

  return (
    <AccountContext.Provider
      value={{
        selectedAccount,
        setSelectedAccount,
        accounts,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
