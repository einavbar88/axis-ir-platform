import React, { useContext } from 'react';
import Select from 'react-select';
import { AccountContext, type Option } from '../../store/AccountContext';

export const SelectAccount: React.FC = () => {
  const { accounts, selectedAccount, setSelectedAccount } =
    useContext(AccountContext);

  return (
    <div className={'flex align-middle pr-8'}>
      <div className='flex items-center w-full max-w-md p-2'>
        <Select
          options={accounts}
          className={'w-52 text-ellipsis'}
          maxMenuHeight={450}
          value={selectedAccount}
          onChange={(selected) => setSelectedAccount(selected as Option)}
        />
      </div>
    </div>
  );
};
