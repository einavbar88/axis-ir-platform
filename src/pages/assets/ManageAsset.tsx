import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API } from '../../api/API';
import { AxisContext } from '../../store/AxisContext';
import { AccountContext } from '../../store/AccountContext';
import routes from '../../constants/routes';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import type { CreateAssetForm } from './types';
import Select from 'react-select';
import {
  tlpOptions,
  priorities,
  osOptions,
  assetStatusOptions,
} from '../../constants/common';

export const ManageAsset: React.FC = () => {
  const { requestOptions } = useContext(AxisContext);
  const { selectedAccount, assetGroupOptions } = useContext(AccountContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [assetData, setAssetData] = useState<CreateAssetForm>({
    assetId: '',
    name: '',
    type: '',
    operatingSystem: '',
    status: '',
    tlp: '',
    priority: 1,
    assetGroupId: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedAccount?.value) return;
    setIsLoading(true);

    API.assets(requestOptions)
      .getById(Number(id))
      .then((res) => {
        const {
          assetId,
          name,
          type,
          operatingSystem,
          status,
          tlp,
          priority,
          assetGroupId,
        } = res.data.responseObject as CreateAssetForm;
        setAssetData({
          assetId,
          name,
          type,
          operatingSystem,
          status,
          tlp,
          priority,
          assetGroupId,
        });
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        navigate('/404');
      });
  }, [selectedAccount, id, requestOptions, navigate]);

  const onChangeField = (e: {
    target: {
      name: string;
      value: string | number | string[] | number[] | undefined;
    };
  }) => {
    const { value, name } = e.target;
    setAssetData({ ...assetData, [name]: value });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log();
    API.assets(requestOptions)
      .update(assetData)
      .then(() => {
        navigate(routes.platform.assets);
      })
      .catch((error) => {
        console.error('Failed to update asset:', error);
      });
  };

  useEffect(() => {
    console.log(assetData.assetGroupId);
  }, [assetData]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        Loading asset data...
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <h1 className='text-2xl font-bold my-5 text-main-darkest'>
        Edit Asset: {assetData?.name || ''}
      </h1>
      <div className='w-full flex justify-around'>
        <div className='w-1/2'>
          <img alt={'Edit Asset'} src={routes.assets.createAsset} />
        </div>
        <div className='w-1/3 flex items-center justify-between bg-main-lightest p-4 rounded-lg'>
          <form
            onSubmit={onSubmit}
            className='flex flex-col items-center w-full space-y-4'
          >
            <div className='w-full'>
              <Input
                name='name'
                label='Asset Name'
                onChange={onChangeField}
                defaultValue={assetData.name || ''}
                inputClasses={'min-w-52'}
                isRequired
              />
            </div>

            <div className='w-full'>
              <p className='block text-sm font-medium text-gray-800'>
                Asset Type
              </p>
              <select
                required
                name='type'
                value={assetData.type || ''}
                onChange={onChangeField}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              >
                <option value='ENDPOINT'>Endpoint</option>
                <option value='SERVER'>Server</option>
                <option value='DATABASE'>Database</option>
                <option value='STORAGE'>Storage</option>
                <option value='CONTAINER'>Container</option>
                <option value='VM'>VM</option>
                <option value='NETWORK'>Network Device</option>
                <option value='OTHER'>Other</option>
              </select>
            </div>

            <div className='w-full'>
              <p className='block text-sm font-medium text-gray-800'>
                Operating System
              </p>
              <select
                required
                name='operatingSystem'
                value={assetData.operatingSystem || ''}
                onChange={onChangeField}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              >
                <option value=''>Select Operating System</option>
                {osOptions.map((os) => (
                  <option key={os} value={os}>
                    {os.charAt(0) + os.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className='w-full'>
              <p className='block text-sm font-medium text-gray-800'>Status</p>
              <select
                required
                name='status'
                value={assetData.status || ''}
                onChange={onChangeField}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              >
                <option value=''>Select Status</option>
                {assetStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className='w-full'>
              <strong>Priority</strong>
              <select
                className='p-2 ml-2 rounded-lg bg-transparent'
                value={assetData.priority}
                name={'priority'}
                onChange={onChangeField}
              >
                {priorities.map((priority, i) => (
                  <option key={priority} value={i + 1}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            <div className='w-full'>
              <p className='block text-sm font-medium text-gray-800'>
                Traffic Light Protocol (TLP)
              </p>
              <select
                required
                name='tlp'
                value={assetData.tlp || ''}
                onChange={onChangeField}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              >
                <option value=''>Select TLP</option>
                {tlpOptions.map((tlp) => (
                  <option key={tlp} value={tlp}>
                    {tlp.charAt(0) + tlp.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className='w-full'>
              <p className='block text-sm font-medium text-gray-800'>
                Asset Groups (optional)
              </p>
              <Select
                required
                isMulti
                name='assetGroupId'
                options={assetGroupOptions}
                value={(typeof assetData.assetGroupId === 'string'
                  ? JSON.parse(assetData.assetGroupId ?? '[]')
                  : (assetData.assetGroupId ?? [])
                ).map((groupId: number) =>
                  assetGroupOptions.find(
                    (group) => Number(group.value) === groupId,
                  ),
                )}
                onChange={(newValue) => {
                  onChangeField({
                    target: {
                      name: 'assetGroupId',
                      value: newValue?.map((v) => v.value),
                    },
                  });
                }}
              />
            </div>

            <div className='flex space-x-4'>
              <Button type='submit' text='Update' theme='primary' />
              <Button
                text='Cancel'
                theme='secondary'
                onClick={() => navigate(-1)}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
