import React, {
  createContext,
  useState,
  type ReactNode,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { API } from '../api/API';
import type { AxiosRequestConfig } from 'axios';
import type { Account } from './types/Account.type';
import { useIsClickOutside } from '../hooks/useIsClickOutside';

const BASE_URL = 'http://localhost:8081/';

type ModalData = {
  ref: React.RefObject<HTMLDivElement>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  param: string;
};

interface AxisContextType {
  accounts: Account[];
  setAccounts: (accounts: Account[]) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  user: User['user'] | null;
  setUser: (user: User['user']) => void;
  isPageLoading: boolean;
  setIsPageLoading: (isPageLoading: boolean) => void;
  requestOptions: AxiosRequestConfig;
  logout: () => void;
  roles: { label: string; value: number }[];
  modals: {
    createAssetGroup: ModalData;
    inviteUser: ModalData;
  };
}

export const AxisContext = createContext<AxisContextType>(
  {} as AxisContextType,
);

interface AxisProviderProps {
  children: ReactNode;
}

type User = {
  user: {
    userId: string;
    username: string;
    roles: { companyId: number; roleId: number }[];
  };
  token: string;
};

export const AxisProvider: React.FC<AxisProviderProps> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [user, setUser] = useState<User['user'] | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [roles, setRoles] = useState<{ label: string; value: number }[]>([]);
  const [requestOptions, setRequestOptions] = useState<AxiosRequestConfig>({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // modals
  const createAssetGroupModalRef = useRef<HTMLDivElement>(null);
  const { isOpen: createAssetGroupModal, setIsOpen: setCreateAssetGroupModal } =
    useIsClickOutside(createAssetGroupModalRef);

  const inviteUserModalRef = useRef<HTMLDivElement>(null);
  const { isOpen: inviteUserModal, setIsOpen: setInviteUserModal } =
    useIsClickOutside(inviteUserModalRef);

  /////////

  const logout = async () => {
    setIsLoggedIn(false);
    setUser(null);
    await API.users(requestOptions).logout(localStorage.getItem('token'));
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.users(requestOptions)
        .loginToken(token)
        .then((res) => {
          if (res.data.responseObject) {
            setUser(res.data.responseObject);
            setIsLoggedIn(true);
          }
        })
        .catch((e) => console.log(e))
        .finally(() => setTimeout(() => setIsPageLoading(false), 2500));
    }
  }, []);

  const loadFromServer = useCallback(
    async (options: AxiosRequestConfig) => {
      if (accounts.length === 0) {
        await API.accounts(options)
          .getByUserId()
          .then(({ data }) => {
            setAccounts(data.responseObject);
          })
          .catch((e) => console.log(e));
      }
      if (roles.length === 0) {
        await API.users(options)
          .getRoles()
          .then((res) => {
            const { roles: allRoles } = res.data.responseObject;
            setRoles(allRoles);
          });
      }
    },
    [requestOptions],
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined,
    };

    const options: AxiosRequestConfig = {
      baseURL: BASE_URL,
      headers,
    };

    setRequestOptions(options);

    if (token) {
      loadFromServer(options);
    }
  }, [user]);

  return (
    <AxisContext.Provider
      value={{
        accounts,
        setAccounts,
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isPageLoading,
        setIsPageLoading,
        requestOptions,
        logout,
        roles,
        modals: {
          createAssetGroup: {
            ref: createAssetGroupModalRef,
            isOpen: createAssetGroupModal,
            setIsOpen: setCreateAssetGroupModal,
            param: 'create-asset-group',
          },
          inviteUser: {
            ref: inviteUserModalRef,
            isOpen: inviteUserModal,
            setIsOpen: setInviteUserModal,
            param: 'invite-user',
          },
        },
      }}
    >
      {children}
    </AxisContext.Provider>
  );
};
