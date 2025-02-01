import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as Plus } from '../../svg/plus.svg';

export const CreateOptions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='relative'>
      <button
        type={'button'}
        onClick={toggleDropdown}
        className='text-main-lightest flex bg-main-mid p-3 ml-2 rounded-xl mb-2'
      >
        <p>Add New</p>
        <Plus className={'ml-2 w-4 h-6'} />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className='origin-top-right absolute left-32 top-0 min-w-40 rounded-md shadow-xl bg-main-white outline-none'
        >
          <div
            className='flex flex-col justify-start items-start py-2 my-2'
            role='menu'
            aria-orientation='vertical'
            aria-labelledby='options-menu'
          >
            {['Ticket', 'Asset', 'User'].map((option, i) => (
              <button
                className={`py-2 px-6 hover:bg-main-dark-50 w-full text-left ${i === 0 ? 'mt-0' : 'mt-2'}`}
                type={'button'}
                key={option}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
