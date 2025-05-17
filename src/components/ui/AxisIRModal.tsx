import React from 'react';

type Props = {
  ref: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
  close: () => void;
  title: string;
  width?: 'wide' | 'narrow';
};

export const AxisIRModal: React.FC<Props> = ({
  children,
  ref,
  close,
  title,
  width = 'narrow',
}) => {
  return (
    <div className='bg-main-dark-50 w-screen h-screen z-50 fixed top-0 left-0 flex justify-center items-center'>
      <div
        className={`bg-main-white ${width === 'narrow' ? 'w-96' : 'w-5/12'} z-100 rounded flex flex-col max-h-[600px]`}
        ref={ref}
      >
        <div className='flex justify-between p-6 bg-main-dark rounded-tl rounded-tr'>
          <h2 className='font-semibold text-lg text-main-white'>{title}</h2>
          <p
            className='font-bold cursor-pointer text-main-white'
            onClick={close}
          >
            X
          </p>
        </div>
        <div className='flex flex-col p-6'>{children}</div>
      </div>
    </div>
  );
};
