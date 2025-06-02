import React, { useContext } from 'react';
import { AccountContext } from '../store/AccountContext';

type Props = {
  defaultValue?: string;
  update: (assignee: string) => void;
  extraClass?: string;
  ref?: React.RefObject<HTMLSelectElement>;
};

export const UserSelect: React.FC<Props> = ({
  defaultValue,
  update,
  extraClass,
  ref,
}) => {
  const { accountUsers } = useContext(AccountContext);

  return (
    <select
      ref={ref}
      className={'p-2 bg-transparent ' + extraClass}
      value={defaultValue}
      onChange={(e) => update(e.target.value)}
    >
      <option key='none' value={''}>
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
