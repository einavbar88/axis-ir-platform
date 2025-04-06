import React, {
  createContext,
  useState,
  type ReactNode,
  useEffect,
} from 'react';
import { API } from '../api/API';
import type { AxiosRequestConfig } from 'axios';
import type { Account } from './types/Account.type';

const BASE_URL = 'http://localhost:8081/';

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
  const [requestOptions, setRequestOptions] = useState<AxiosRequestConfig>({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

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
      API.accounts(options)
        .getByUserId()
        .then(({ data }) => {
          setAccounts(data.responseObject);
        })
        .catch((e) => console.log(e));
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
      }}
    >
      {children}
    </AxisContext.Provider>
  );
};
