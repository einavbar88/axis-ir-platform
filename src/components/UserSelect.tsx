import React, { useContext } from 'react';
import { AccountContext } from '../store/AccountContext';

type Props = {
  defaultValue?: string;
  update: (assignee: string) => void;
};

export const UserSelect: React.FC<Props> = ({ defaultValue, update }) => {
  const { accountUsers } = useContext(AccountContext);

  return (
    <select value={defaultValue} onChange={(e) => update(e.target.value)}>
      <option key='null' value={'null'}>
        Select Assignee
      </option>
      {accountUsers.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
