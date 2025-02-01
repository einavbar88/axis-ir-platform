import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SelectAccount } from './SelectAccount';
import { AccountContext } from '../../store/AccountContext';

export const TopBar = () => {
  const { selectedAccount } = useContext(AccountContext);

  return (
    <div
      className={
        'flex justify-between align-middle h-16 w-full bg-main fixed top-0 shadow-md z-50 font-poppins'
      }
    >
      <div className='flex pl-8 py-2 w-60'>
        <Link to={'/'}>
          <img
            className={'rounded-3xl'}
            style={{ width: '100px' }}
            src={'./AxisIR.png'}
            alt={'AxisIR'}
          />
        </Link>
      </div>
      <div className={'flex align-middle justify-between w-full'}>
        <div />
        <div className={'content-center'}>
          <h3
            className={'font-extrabold text-main-darkest'}
            style={{
              textShadow:
                '-0.855px -0.855px 0 #d1e3ff, 0.855px -0.855px 0 #d1e3ff, -0.855px 0.855px 0 #d1e3ff, 0.855px 0.855px 0 #d1e3ff',
            }}
          >
            {selectedAccount.value ? selectedAccount.label : ''}
          </h3>
        </div>
        <SelectAccount />
      </div>
    </div>
  );
};
