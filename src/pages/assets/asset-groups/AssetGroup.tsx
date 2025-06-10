import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AxisContext } from '../../../store/AxisContext';
import { API } from '../../../api/API';
import { Button } from '../../../components/ui/Button';
import { CreateAssetGroup } from './CreateAssetGroup';
import { useIsClickOutside } from '../../../hooks/useIsClickOutside';
import type { Asset } from '../types';
import { DataTable } from '../../../components/ui/Table';
import { assetsColumns } from '../common';
import routes from '../../../constants/routes';
import { AccountContext } from '../../../store/AccountContext';

export const AssetGroup: React.FC = () => {
  const { id } = useParams();
  const { requestOptions } = useContext(AxisContext);
  const { assetGroupOptions } = useContext(AccountContext);
  const ref = useRef<HTMLDivElement>(null);
  const { isOpen, setIsOpen } = useIsClickOutside(ref);
  const navigate = useNavigate();

  const [assetGroup, setAssetGroup] = useState<{
    title: string;
    description: string;
    assetGroupId: string;
  }>();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [timeFrame, setTimeFrame] = useState<string>('all time');
  const [iocData, setIocData] = useState<any>();

  const updateAssetGroup = () => {
    API.assets(requestOptions)
      .getAssetGroup(Number(id))
      .then((res) => setAssetGroup(res.data.responseObject))
      .catch((e) => {});
  };
  useEffect(() => {
    if (id) {
      updateAssetGroup();
      API.assets(requestOptions)
        .getAssetsByAssetGroup(id)
        .then((res) =>
          setAssets(
            res.data.responseObject.map((asset: Asset) => ({
              ...asset,
              assetGroupId: JSON.parse(asset.assetGroupId ?? '[]')
                .map(
                  (groupId: number) =>
                    assetGroupOptions.find(
                      (group) => Number(group.value) === groupId,
                    )?.label,
                )
                .join(', '),
            })),
          ),
        )
        .catch((e) => {});
      // API.assets(requestOptions)
      //   .getIocForAssetGroup(id, timeFrame)
      //   .then((res) => setIocData(res.data.responseObject))
      //   .catch(() => {});
    }
  }, [id, requestOptions, timeFrame]);

  useEffect(() => {
    if (!isOpen) {
      updateAssetGroup();
    }
  }, [isOpen]);
  return (
    <div className='flex flex-col w-full'>
      {isOpen && (
        <CreateAssetGroup
          assetGroup={assetGroup}
          onClose={() => setIsOpen(false)}
        />
      )}
      <div className='flex 2-full justify-between items-center mb-6'>
        <div />
        <h1 className='text-2xl font-semibold text-center text-main-darkest my-5'>
          {assetGroup?.title}
        </h1>
        <Button
          text={'Edit asset group'}
          theme={'primary'}
          onClick={() => setIsOpen(true)}
        />
      </div>
      <div className='w-full flex'>
        <p className='text-sm mr-2 font-semibold text-main-darkest'>
          Description:
        </p>
        <p className='w-full text-sm text-gray-800'>
          {assetGroup?.description}
        </p>
      </div>
      <DataTable
        columns={assetsColumns}
        rows={assets}
        paginationModel={{ page: 0, pageSize: 10 }}
        onClickRow={(asset) => {
          navigate(routes.platform.assetPage.replace(':id', asset.row.assetId));
        }}
      />
    </div>
  );
};
