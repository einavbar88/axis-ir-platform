import React, {
  createContext,
  useState,
  type ReactNode,
  useEffect,
} from 'react';
import { API } from '../api/API';

interface AxisContextType {
  accounts: any[];
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  user: User | null;
  setUser: (user: User) => void;
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
const mockAccounts = [
  { name: 'Microsoft', id: '12345' },
  { name: 'Apple', id: '54321' },
  { name: 'Price Waterhouse Coopers', id: '11111' },
];

export const AxisProvider: React.FC<AxisProviderProps> = ({ children }) => {
  const [accounts, setAccounts] = useState<any[]>(mockAccounts);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.users
        .loginToken(token)
        .then((res) => {
          if (res.data.responseObject) {
            setUser(res.data.responseObject);
            setIsLoggedIn(true);
          }
        })
        .catch((e) => console.log(e));
    }
  }, []);

  return (
    <AxisContext.Provider
      value={{ accounts, isLoggedIn, setIsLoggedIn, user, setUser }}
    >
      {children}
    </AxisContext.Provider>
  );
};
