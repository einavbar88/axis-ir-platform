import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AxisContext } from '../../store/AxisContext';
import { AccountContext } from '../../store/AccountContext';
import { API } from '../../api/API';
import routes from '../../constants/routes';
import type { CreateAssetForm } from './types';
import Select from 'react-select';
import {
  tlpOptions,
  priorities,
  osOptions,
  assetStatusOptions,
} from '../../constants/common';
import { getVisibleString } from '../helper';

export const CreateAsset: React.FC = () => {
  const { requestOptions } = useContext(AxisContext);
  const { selectedAccount, assetGroupOptions } = useContext(AccountContext);
  const navigate = useNavigate();

  const [assetData, setAssetData] = useState<CreateAssetForm>({
    name: '',
    type: '',
    operatingSystem: '',
    status: '',
    tlp: '',
    priority: 1,
    assetGroupId: undefined,
  });

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

    if (!selectedAccount?.value) {
      console.error('No account selected');
      return;
    }

    const payload: CreateAssetForm = {
      ...assetData,
      companyId: selectedAccount?.value,
      createdAt: new Date().toISOString(),
    };

    API.assets(requestOptions)
      .create(payload)
      .then((res) => {
        navigate(routes.platform.assets);
      })
      .catch((err) => {
        console.error('Error creating asset:', err);
      });
  };

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <h1 className='text-2xl font-bold my-5 text-main-darkest'>
        Create New Asset
      </h1>
      <div className='w-full flex justify-around'>
        <div className='w-1/2'>
          <img alt={'New Asset'} src={routes.assets.createAsset} />
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
                onChange={onChangeField}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              >
                <option value=''>Select Operating System</option>
                {osOptions.map((os) => (
                  <option key={os} value={os}>
                    {getVisibleString(os)}
                  </option>
                ))}
              </select>
            </div>

            <div className='w-full'>
              <p className='block text-sm font-medium text-gray-800'>Status</p>
              <select
                required
                name='status'
                onChange={onChangeField}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              >
                <option value=''>Select Status</option>
                {assetStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {getVisibleString(status)}
                  </option>
                ))}
              </select>
            </div>
            <div className='w-full'>
              <strong>Priority</strong>
              <select
                className='p-2 ml-2 rounded-lg bg-transparent'
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
                onChange={onChangeField}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              >
                <option value=''>Select TLP</option>
                {tlpOptions.map((tlp) => (
                  <option key={tlp} value={tlp}>
                    {getVisibleString(tlp)}
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
                onChange={(newValue) =>
                  onChangeField({
                    target: {
                      name: 'assetGroupId',
                      value: newValue.map((v) => v.value),
                    },
                  })
                }
              />
            </div>

            <Button type={'submit'} text={'Create'} theme={'primary'} />
          </form>
        </div>
      </div>
    </div>
  );
};
