import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API } from '../../api/API';
import { AxisContext } from '../../store/AxisContext';
import type { Account } from '../../store/types/Account.type';
import routes from '../../constants/routes';

export const ManageAccount: React.FC = () => {
  const { requestOptions } = useContext(AxisContext);
  const { id } = useParams();

  const [accountData, setAccountData] = useState<Account>();

  useEffect(() => {
    API.accounts(requestOptions)
      .getById(Number(id))
      .then((res) => {
        setAccountData(res.data.responseObject);
      });
  }, []);

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='flex justify-center mb-4 items-center w-full relative'>
        <h1 className='text-2xl font-bold text-center'>Account Details</h1>
        <Link
          className='absolute right-12 p-2 bg-main-lightest rounded-md'
          to={routes.platform.editAccount.replace(':id', id as string)}
        >
          Edit
        </Link>
      </div>
      <div className='space-y-2 text-gray-700 w-full grid grid-cols-3 mb-4'>
        <div className='flex justify-start'>
          <span className='font-semibold mr-2'>Company ID:</span>
          <span>{accountData?.companyId}</span>
        </div>
        <div className='flex justify-start'>
          <span className='font-semibold mr-2'>CIN:</span>
          <span>{accountData?.cin}</span>
        </div>
        <div className='flex justify-start'>
          <span className='font-semibold mr-2'>Industry:</span>
          <span>{accountData?.industry}</span>
        </div>
        <div className='flex justify-start'>
          <span className='font-semibold mr-2'>Address:</span>
          <span>{accountData?.address}</span>
        </div>
        <div className='flex justify-start'>
          <span className='font-semibold mr-2'>Email:</span>
          <span>{accountData?.primaryEmail}</span>
        </div>
        <div className='flex justify-start'>
          <span className='font-semibold mr-2'>Phone:</span>
          <span>{accountData?.primaryPhone}</span>
        </div>
      </div>
    </div>
  );
};
