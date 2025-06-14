import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from 'react';
import { AxisContext } from './AxisContext';
import { API } from '../api/API';
import { Role } from './enums';

export type Option = {
  label: string;
  value: string;
};

interface AccountContextType {
  setSelectedAccount: (value: Option) => void;
  selectedAccount?: Option;
  accounts: Option[];
  assetGroupOptions: Option[];
  hasAdminAccess: boolean;
  userRoleIdForAccount?: number;
  accountUsers: Option[];
  assetsOptions: Option[];
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
  const {
    accounts: dbAccounts,
    requestOptions,
    user,
  } = useContext(AxisContext);
  const [selectedAccount, setSelectedAccount] = useState<Option>();
  const [accounts, setAccounts] = useState<Option[]>([]);
  const [accountUsers, setAccountUsers] = useState<Option[]>([]);
  const [assetGroupOptions, setAssetGroupOptions] = useState<any[]>([]);
  const [assetsOptions, setAssetsOptions] = useState<any[]>([]);
  const [userRoleIdForAccount, setUserRoleIdForAccount] = useState<number>();
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean>(false);

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

  useEffect(() => {
    if (!selectedAccount?.value) return;
    API.assets(requestOptions)
      .getAssetGroups(selectedAccount?.value)
      .then((res) =>
        setAssetGroupOptions(
          res.data?.responseObject?.map((assetGroup: any) => ({
            value: assetGroup.assetGroupId,
            label: assetGroup.title,
          })) || [],
        ),
      )
      .catch((e) => {});

    API.assets(requestOptions)
      .getAssets(selectedAccount?.value)
      .then((res) =>
        setAssetsOptions(
          res.data?.responseObject?.map((asset: any) => ({
            value: asset.assetId,
            label: asset.name,
          })) || [],
        ),
      )
      .catch((e) => {});

    const roleId = user?.roles.find(
      (role) => Number(selectedAccount?.value) === role.companyId,
    )?.roleId;
    if (roleId) {
      setUserRoleIdForAccount(roleId);
      setHasAdminAccess([Role.ADMIN, Role.MANAGER].includes(roleId));
    }

    API.users(requestOptions)
      .getByCompanyId(selectedAccount.value)
      .then((res) => {
        const users = res.data.responseObject.map((user: any) => ({
          label: user.username,
          value: user.userId,
        }));
        setAccountUsers(users);
      });
  }, [selectedAccount]);

  return (
    <AccountContext.Provider
      value={{
        assetGroupOptions,
        selectedAccount,
        setSelectedAccount,
        accounts,
        userRoleIdForAccount,
        hasAdminAccess,
        accountUsers,
        assetsOptions,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
