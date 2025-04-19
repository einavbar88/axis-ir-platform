import React from 'react';
import { Link } from 'react-router-dom';
import { SelectAccount } from './SelectAccount';
import routes from '../../constants/routes';
import { UserOptions } from './UserOptions';

export const TopBar = () => {
  return (
    <div
      className={
        'flex justify-between align-middle h-16 w-full bg-main fixed top-0 shadow-md z-20 font-poppins'
      }
    >
      <div className='flex pl-8 py-2 w-60'>
        <Link to={routes.platform.home}>
          <img
            className={'rounded-3xl'}
            style={{ width: '100px' }}
            src={routes.assets.logo}
            alt={'AxisIR'}
          />
        </Link>
      </div>
      <div className={'flex align-middle justify-between w-full'}>
        <div />
        <SelectAccount />
        <div className='flex items-center pr-2'>
          <UserOptions />
        </div>
      </div>
    </div>
  );
};
