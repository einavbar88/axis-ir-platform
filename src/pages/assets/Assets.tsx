import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AxisContext } from '../../store/AxisContext';
import { AccountContext } from '../../store/AccountContext';
import { API } from '../../api/API';
import routes from '../../constants/routes';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { DataTable } from '../../components/ui/Table';
import type { Asset } from './types';
import { assetsColumns } from './common';

export const Assets: React.FC = () => {
  const { requestOptions } = useContext(AxisContext);
  const { selectedAccount, assetGroupOptions } = useContext(AccountContext);
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (selectedAccount?.value) {
      setLoading(true);
      API.assets(requestOptions)
        .getAssets(selectedAccount?.value)
        .then((res) => {
          const withGroups = res.data.responseObject.map((asset: Asset) => ({
            ...asset,
            assetGroupId: JSON.parse(asset.assetGroupId ?? '[]')
              .map(
                (groupId: number) =>
                  assetGroupOptions.find(
                    (group) => Number(group.value) === groupId,
                  )?.label,
              )
              .join(', '),
          }));
          setAssets(withGroups);
          setLoading(false);
        })
        .catch((err: any) => {
          console.error('Error fetching assets:', err);
          setLoading(false);
        });
    }
  }, [selectedAccount, requestOptions, assetGroupOptions]);

  return (
    <div className='flex flex-col w-full'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-main-darkest'>Assets</h1>
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
            columns={assetsColumns}
            rows={assets}
            paginationModel={{ page: 0, pageSize: 10 }}
            onClickRow={(asset) => {
              navigate(
                routes.platform.assetPage.replace(':id', asset.row.assetId),
              );
            }}
          />
        </div>
      )}
    </div>
  );
};
