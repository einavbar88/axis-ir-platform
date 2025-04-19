import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API } from '../../api/API';
import { AxisContext } from '../../store/AxisContext';
import type { Account } from '../../store/types/Account.type';
import type { GridColDef } from '@mui/x-data-grid';
import { DataTable } from '../../components/ui/Table';
import routes from '../../constants/routes';

export const ManageAccount: React.FC = () => {
  const { requestOptions, roles } = useContext(AxisContext);
  const { id } = useParams();

  const [accountData, setAccountData] = useState<Account>();
  const [data, setData] = useState<Partial<Account>[]>([]);
  const columns: GridColDef[] = [
    { field: 'userId', headerName: 'ID', width: 70 },
    { field: 'username', headerName: 'User Name', minWidth: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'roleId', headerName: 'Role', minWidth: 200 },
  ];

  const onSelectRow = () => {
    console.log('onSelectRow');
  };

  useEffect(() => {
    API.users(requestOptions)
      .getByCompanyId(id as string)
      .then((res) => {
        setData(
          res.data.responseObject.map((user: any) => ({
            ...user,
            roleId: roles.find((r) => r.value === user.roleId)?.label,
          })),
        );
      });
    API.accounts(requestOptions)
      .getById(Number(id))
      .then((res) => {
        console.log(res.data.responseObject);
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
      <h1 className='text-2xl font-bold mb-4 text-center'>Account users</h1>
      <div className='w-full flex justify-around'>
        <DataTable
          rows={data}
          columns={columns}
          onClickRow={onSelectRow}
          paginationModel={{ page: 0, pageSize: 5 }}
          disableColumnFilter={true}
          disableColumnMenu={true}
          disableColumnSelector={true}
        />
      </div>
    </div>
  );
};
