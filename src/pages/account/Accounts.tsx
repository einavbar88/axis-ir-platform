import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GridColDef } from '@mui/x-data-grid';
import { ReactComponent as Plus } from '../../svg/plus.svg';
import { AxisContext } from '../../store/AxisContext';
import { DataTable } from '../../components/ui/Table';
import type { Account } from '../../store/types/Account.type';
import { Button } from '../../components/ui/Button';
import routes from '../../constants/routes';
import { AccountContext } from '../../store/AccountContext';

export const Accounts: React.FC = () => {
  const { accounts } = useContext(AxisContext);
  const { setSelectedAccount } = useContext(AccountContext);
  const navigate = useNavigate();
  const [data, setData] = useState<Partial<Account>[]>([]);
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Account Name', minWidth: 200 },
    { field: 'industry', headerName: 'Industry', width: 130 },
    { field: 'primaryEmail', headerName: 'Email', minWidth: 130 },
    { field: 'primaryPhone', headerName: 'Phone #', minWidth: 130 },
    { field: 'address', headerName: 'Address', minWidth: 130 },
  ];

  const onSelectRow = ({ row }: any) => {
    setSelectedAccount({ value: row.id, label: row.name });
    navigate(routes.platform.manageAccount.replace(':id', row.id));
  };

  useEffect(() => {
    setData(
      accounts.map((account) => ({
        id: account.companyId,
        name: account.name,
        industry: account.industry,
        primaryEmail: account.primaryEmail,
        primaryPhone: account.primaryPhone,
        address: account.address,
      })),
    );
  }, [accounts]);

  return (
    <div className='container mx-auto p-4 text-main-darkest'>
      <div className={'flex justify-between items-center'}>
        <h1 className='text-2xl font-bold mb-4 text-center'>My Accounts</h1>
        <Button
          text={'Create Account'}
          theme={'primary'}
          icon={() => <Plus className='ml-2 w-4 h-6' />}
          linkTo={routes.platform.createAccount}
        />
      </div>
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
  );
};
