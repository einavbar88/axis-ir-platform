import React, { useContext, useRef } from 'react';
import { AccountContext, type Option } from '../../store/AccountContext';
import routes from '../../constants/routes';
import { useIsClickOutside } from '../../hooks/useIsClickOutside';
import { Link } from 'react-router-dom';

export const SelectAccount: React.FC = () => {
  const { accounts, selectedAccount, setSelectedAccount } =
    useContext(AccountContext);

  const selectAccountRef = useRef<HTMLDivElement>(null);
  const { isOpen, setIsOpen } = useIsClickOutside(selectAccountRef);

  return selectedAccount ? (
    <div
      ref={selectAccountRef}
      className={'flex align-middle pr-2'}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={'flex items-center relative'}>
        <h3
          className={'font-extrabold text-main-darkest mr-2'}
          style={{
            fontSize: '17px',
            textShadow:
              '-0.855px -0.855px 0 #d1e3ff, 0.855px -0.855px 0 #d1e3ff, -0.855px 0.855px 0 #d1e3ff, 0.855px 0.855px 0 #d1e3ff',
          }}
        >
          {selectedAccount?.value ? selectedAccount.label : ''}
        </h3>
        <img
          src={routes.assets.chevron}
          alt={'chev'}
          height={'20px'}
          width={'20px'}
          className={'cursor-pointer'}
          style={isOpen ? { transform: 'rotate(180deg)' } : {}}
        />
      </div>
      {isOpen && (
        <div
          className={
            'absolute z-20 top-14 bg-main-white bg-white shadow-md rounded-lg w-44 overflow-hidden'
          }
        >
          <div className='p-4 font-bold border-b border-dashed'>
            My accounts
          </div>
          {accounts.map((account: Option) => (
            <div
              key={account.value}
              className='px-4 py-4 hover:bg-main-dark-50 cursor-pointer'
            >
              <div className=''>{account.label}</div>
            </div>
          ))}
          <div className='p-4 font-semibold border-t border-dashed cursor-pointer hover:bg-main-dark-50'>
            <Link to={routes.platform.createAccount}>+ Add account</Link>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div />
  );
};
