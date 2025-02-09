import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from 'react';
import { AxisContext } from './AxisContext';

export type Option = {
  label: string;
  value: string;
};

interface AccountContextType {
  setSelectedAccount: (value: Option) => void;
  selectedAccount?: Option;
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

  const [selectedAccount, setSelectedAccount] = useState<Option>();
  const [accounts, setAccounts] = useState<Option[]>([]);

  useEffect(() => {
    const accounts = dbAccounts.map(
      (account: { name: string; companyId: string }) => ({
        label: account.name,
        value: account.companyId,
      }),
    );
    setAccounts(accounts);
    if (!selectedAccount) {
      setSelectedAccount(accounts[0]);
    }
  }, [dbAccounts]);

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
