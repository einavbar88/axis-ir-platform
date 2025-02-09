import React, {
  createContext,
  useState,
  type ReactNode,
  useEffect,
} from 'react';
import { API } from '../api/API';
import type { AxiosRequestConfig } from 'axios';

const BASE_URL = 'http://localhost:8080/';

interface AxisContextType {
  accounts: any[];
  setAccounts: (accounts: any[]) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  user: User['user'] | null;
  setUser: (user: User['user']) => void;
  isPageLoading: boolean;
  setIsPageLoading: (isPageLoading: boolean) => void;
  requestOptions: AxiosRequestConfig;
}

export const AxisContext = createContext<AxisContextType>(
  {} as AxisContextType,
);

interface AxisProviderProps {
  children: ReactNode;
}

type User = {
  user: { userId: string; username: string };
  token: string;
};

export const AxisProvider: React.FC<AxisProviderProps> = ({ children }) => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [user, setUser] = useState<User['user'] | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [requestOptions, setRequestOptions] = useState<AxiosRequestConfig>({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

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
      }}
    >
      {children}
    </AxisContext.Provider>
  );
};
