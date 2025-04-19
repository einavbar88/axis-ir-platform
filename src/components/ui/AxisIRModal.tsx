import React from 'react';

type Props = {
  ref: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
  close: () => void;
  title: string;
};

export const AxisIRModal: React.FC<Props> = ({
  children,
  ref,
  close,
  title,
}) => {
  return (
    <div className='bg-main-dark-50 w-screen h-screen z-50 fixed top-0 left-0 flex justify-center items-center'>
      <div className='bg-main-white w-96 z-100 rounded flex flex-col' ref={ref}>
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
