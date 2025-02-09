import React, { useContext, useRef } from 'react';
import { AxisContext } from '../../store/AxisContext';
import { Link } from 'react-router-dom';
import routes from '../../constants/routes';
import { useIsClickOutside } from '../../hooks/useIsClickOutside';

export const UserOptions: React.FC = () => {
  const { user } = useContext(AxisContext);
  const ref = useRef<HTMLDivElement>(null);

  const { isOpen, setIsOpen } = useIsClickOutside(ref);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='relative' ref={ref}>
      <img
        src={routes.assets.user}
        alt={'user options'}
        style={{ width: '40px', cursor: 'pointer' }}
        onClick={toggleDropdown}
      />
      {isOpen && (
        <div
          id='user-dropdown'
          className='absolute z-20 top-10 bg-main-white right-0 bg-white shadow-md rounded-lg p-2 w-44'
        >
          <div className='flex items-center justify-center'>
            <div className='flex flex-col items-center'>
              <span className='bg-main-lighter flex items-center justify-center font-bold text-main-dark p-1 rounded-full text-white w-10 h-10'>
                {user?.username[0]}
              </span>
              <span className='text-sm'>{user?.username}</span>
              <span className='text-xs'>
                <Link
                  to={routes.platform.profile}
                  className='text-main-darkest'
                >
                  View Profile
                </Link>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
