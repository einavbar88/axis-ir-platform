import React, { useRef } from 'react';
import { ReactComponent as Plus } from '../../svg/plus.svg';
import { Button } from '../ui/Button';
import { createOptions } from '../../constants/createOptions';
import { Link } from 'react-router-dom';
import { useIsClickOutside } from '../../hooks/useIsClickOutside';

export const CreateOptions = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { isOpen, setIsOpen } = useIsClickOutside(ref);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='relative' ref={ref}>
      <Button
        theme={'primary'}
        onClick={toggleDropdown}
        text={'Add New'}
        icon={() => <Plus className='ml-2 w-4 h-6' />}
      />
      {isOpen && (
        <div className='origin-top-right absolute left-32 top-0 min-w-40 rounded-md shadow-xl bg-main-white outline-none overflow-hidden'>
          <div
            className='flex flex-col justify-start items-start'
            role='menu'
            aria-orientation='vertical'
            aria-labelledby='options-menu'
          >
            {createOptions.map((option) => (
              <Link
                to={option.uri}
                key={option.name}
                className={`py-4 px-6 flex hover:bg-main-dark-50 text-left w-full`}
                onClick={() => setIsOpen(false)}
              >
                {option.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
