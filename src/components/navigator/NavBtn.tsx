import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  to: string;
  text: string;
};

export const NavBtn: React.FC<Props> = ({ to, text }) => {
  return (
    <li>
      <Link
        to={to}
        className='flex items-center gap-4 p-3 rounded-md hover:bg-main-dark-50 hover:text-main-lightest'
      >
        <span>{text}</span>
      </Link>
    </li>
  );
};
