import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AxisContext } from '../../../store/AxisContext';
import { AccountContext } from '../../../store/AccountContext';
import { API } from '../../../api/API';
import routes from '../../../constants/routes';
import { Button } from '../../../components/ui/Button';
import { Loader } from '../../../components/ui/Loader';
import { DataTable } from '../../../components/ui/Table';
import type { GridColDef } from '@mui/x-data-grid';

interface AssetGroup {
  title: string;
  description: string;
}

export const AssetGroups: React.FC = () => {
  const { requestOptions } = useContext(AxisContext);
  const { selectedAccount } = useContext(AccountContext);
  const navigate = useNavigate();
  const [assetGroups, setAssetGroups] = useState<AssetGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const columns: GridColDef[] = [
    { field: 'assetGroupId', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Name', minWidth: 200 },
    { field: 'description', headerName: 'Description', minWidth: 300 },
  ];

  useEffect(() => {
    if (selectedAccount?.value) {
      setLoading(true);
      API.assets(requestOptions)
        .getAssetGroups(selectedAccount?.value)
        .then((res) => {
          setAssetGroups(res.data.responseObject || []);
          setLoading(false);
        })
        .catch((err: any) => {
          console.error('Error fetching assets:', err);
          setLoading(false);
        });
    }
  }, [selectedAccount, requestOptions]);

  return (
    <div className='flex flex-col w-full'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-main-darkest'>Asset groups</h1>
        <Link to={routes.platform.createAssetGroup}>
          <Button type='button' text='Create Asset' theme='primary' />
        </Link>
      </div>

      {loading ? (
        <div className='flex justify-center my-20'>
          <Loader />
        </div>
      ) : assetGroups.length === 0 ? (
        <div className='bg-white rounded-lg shadow p-6 text-center'>
          <h3 className='text-lg font-medium text-gray-900'>
            No asset groups found
          </h3>
          <p className='mt-2 text-gray-500'>
            Start by adding a new asset group to your account.
          </p>
        </div>
      ) : (
        <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
          <DataTable
            columns={columns}
            rows={assetGroups}
            paginationModel={{ page: 0, pageSize: 10 }}
            onClickRow={(asset) => {
              navigate(
                routes.platform.assetGroupPage.replace(
                  ':id',
                  asset.row.assetGroupId,
                ),
              );
            }}
          />
        </div>
      )}
    </div>
  );
};
