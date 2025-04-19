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
    if (dbAccounts.length > 0) {
      const accounts = dbAccounts.map(
        (account: { name: string; companyId: string }) => ({
          label: account.name,
          value: account.companyId,
        }),
      );

      setAccounts(accounts);
    }
  }, [dbAccounts]);

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0]);
    }
  }, [accounts, selectedAccount]);

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
