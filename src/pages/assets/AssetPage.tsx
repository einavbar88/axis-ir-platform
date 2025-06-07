import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import routes from '../../constants/routes';
import type { CreateAssetForm } from './types';
import { API } from '../../api/API';
import { AxisContext } from '../../store/AxisContext';
import { AccountContext, type Option } from '../../store/AccountContext';
import { TimeFrameSelector } from '../../components/ui/TimeFrameSelector';
import { getVisibleString } from '../helper';

export const AssetPage: React.FC = () => {
  const { id } = useParams();
  const { requestOptions } = useContext(AxisContext);
  const { assetGroupOptions } = useContext(AccountContext);
  const [assetData, setAssetData] = useState<CreateAssetForm>();
  const [iocData, setIocData] = useState<any>();
  const [timeFrame, setTimeFrame] = useState<string>('all time');

  useEffect(() => {
    if (id) {
      API.assets(requestOptions)
        .getById(Number(id))
        .then((res) =>
          setAssetData({
            ...res.data.responseObject,
            assetGroupId: JSON.parse(
              res.data.responseObject.assetGroupId ?? '[]',
            )
              .map(
                (groupId: number) =>
                  assetGroupOptions.find(
                    (group: Option) => Number(group.value) === groupId,
                  )?.label,
              )
              .join(', '),
          }),
        );
      API.assets(requestOptions)
        .getIocForAssets(id, timeFrame)
        .then((res) => setIocData(res.data.responseObject))
        .catch();
    }
  }, [id, assetGroupOptions, requestOptions, timeFrame]);

  const getVisibleText = (text?: string, isDate = false) => {
    if (!text) return '';
    if (isDate) return new Date(text).toLocaleString();
    return `${getVisibleString(text)}`;
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-8'>
        <div />
        <h1 className='text-2xl font-bold text-main-darkest'>
          {assetData?.name}
        </h1>
        <Button
          text={'Edit asset'}
          linkTo={routes.platform.manageAsset.replace(':id', `${id}`)}
          theme={'primary'}
        />
      </div>
      <div className='flex justify-around'>
        <div className='w-[400px] flex flex-col items-start rounded-lg overflow-hidden'>
          <p className='text-gray-800 font-semibold w-full flex justify-between p-2 bg-main-lightest'>
            Asset ID#
            <span className='text-main-darkest ml-5'>{assetData?.assetId}</span>
          </p>
          <p className='text-gray-800 font-semibold w-full flex justify-between p-2 bg-main-light-green'>
            Type
            <span className='text-main-darkest ml-5'>
              {getVisibleText(assetData?.type)}
            </span>
          </p>
          <p className='text-gray-800 font-semibold w-full flex justify-between p-2 bg-main-lightest'>
            Operating system
            <span className='text-main-darkest ml-5'>
              {getVisibleText(assetData?.operatingSystem)}
            </span>
          </p>
          <p className='text-gray-800 font-semibold w-full flex justify-between p-2 bg-main-light-green'>
            Last heartbeat
            <span className='text-main-darkest ml-5'>
              {getVisibleText(assetData?.lastHeartbeat, true)}
            </span>
          </p>
        </div>
        <div className='w-[400px] flex flex-col items-center rounded-lg overflow-hidden'>
          <p className='text-gray-800 font-semibold w-full flex justify-between p-2 bg-main-lightest'>
            TLP
            <span
              className={`text-main-darkest ml-5 text-${assetData?.tlp.toLowerCase()}`}
            >
              {getVisibleText(assetData?.tlp)}
            </span>
          </p>
          <p className='text-gray-800 font-semibold w-full flex justify-between p-2 bg-main-light-green'>
            Status
            <span className='text-main-darkest ml-5'>
              {getVisibleText(assetData?.status)}
            </span>
          </p>
          <p className='text-gray-800 font-semibold w-full flex justify-between p-2 bg-main-lightest'>
            Has metadata
            <span className='text-main-darkest ml-5'>
              {assetData?.metaData ? 'Yes' : 'No'}
            </span>
          </p>
          <p className='text-gray-800 font-semibold w-full flex justify-between p-2 bg-main-light-green'>
            Asset groups
            <span className='text-main-darkest ml-5'>
              {assetData?.assetGroupId}
            </span>
          </p>
        </div>
      </div>
      <div className='flex flex-col items-center mt-8'>
        <div className='flex'>
          <TimeFrameSelector
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
          />
        </div>
      </div>
    </div>
  );
};
