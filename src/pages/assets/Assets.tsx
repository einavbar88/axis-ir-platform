import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AxisContext } from '../../store/AxisContext';
import { AccountContext } from '../../store/AccountContext';
import { API } from '../../api/API';
import routes from '../../constants/routes';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { DataTable } from '../../components/ui/Table';
import type { GridColDef } from '@mui/x-data-grid';

interface Asset {
  assetId: number;
  name: string;
  type: string;
  operatingSystem: string;
  status: string;
  tlp: string;
  priority: number;
  lastHeartbeat?: string;
}

export const Assets: React.FC = () => {
  const { requestOptions } = useContext(AxisContext);
  const { selectedAccount } = useContext(AccountContext);
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const columns: GridColDef[] = [
    { field: 'assetId', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', minWidth: 200 },
    { field: 'type', headerName: 'Type', width: 130 },
    { field: 'operatingSystem', headerName: 'OS', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
    },
    {
      field: 'tlp',
      headerName: 'TLP',
      width: 100,
    },
    { field: 'priority', headerName: 'Priority', width: 100, type: 'number' },
    {
      field: 'lastHeartbeat',
      headerName: 'Last Heartbeat',
      minWidth: 180,
    },
  ];

  useEffect(() => {
    if (selectedAccount?.value) {
      setLoading(true);
      API.assets(requestOptions)
        .getAssets(selectedAccount?.value)
        .then((res) => {
          setAssets(res.data.responseObject || []);
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
        <h1 className='text-2xl font-bold'>Assets</h1>
        <Link to={routes.platform.createAsset}>
          <Button type='button' text='Create Asset' theme='primary' />
        </Link>
      </div>

      {loading ? (
        <div className='flex justify-center my-20'>
          <Loader />
        </div>
      ) : assets.length === 0 ? (
        <div className='bg-white rounded-lg shadow p-6 text-center'>
          <h3 className='text-lg font-medium text-gray-900'>No assets found</h3>
          <p className='mt-2 text-gray-500'>
            Start by adding a new asset to your account.
          </p>
        </div>
      ) : (
        <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
          <DataTable
            columns={columns}
            rows={assets}
            paginationModel={{ page: 0, pageSize: 10 }}
            onClickRow={(asset) => {
              navigate(
                routes.platform.manageAsset.replace(':id', asset.row.assetId),
              );
            }}
          />
        </div>
      )}
    </div>
  );
};
