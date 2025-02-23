import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../api/API';
import { AxisContext } from '../../store/AxisContext';
import { AccountContext } from '../../store/AccountContext';

export const ManageAccount: React.FC = () => {
  const { requestOptions } = useContext(AxisContext);
  const { selectedAccount } = useContext(AccountContext);

  const navigate = useNavigate();
  const [accountData, setAccountData] = useState<any>({});

  useEffect(() => {
    if (!selectedAccount) navigate('/404');
    if (!selectedAccount?.value) return;
    API.accounts(requestOptions)
      .getById(Number(selectedAccount?.value))
      .then((res) => {
        setAccountData(res.data.responseObject);
      });
  }, [selectedAccount]);

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='text-2xl font-bold mb-4 text-center'>
        {accountData?.name}
      </h1>
    </div>
  );
};
