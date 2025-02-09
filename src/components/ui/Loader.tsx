import React from 'react';
import { DNA } from 'react-loader-spinner';

type Props = {
  size?: number;
  wrapperClass?: string;
};

export const Loader: React.FC<Props> = ({ size = 80, wrapperClass }) => {
  return (
    <div className='w-full mt-20 flex flex-col items-center justify-center '>
      <DNA
        height={`${size}`}
        width={`${size}`}
        ariaLabel='loading'
        wrapperClass={wrapperClass}
      />
    </div>
  );
};
