import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AxisContext } from '../../store/AxisContext';
import { AccountContext } from '../../store/AccountContext';
import { API } from '../../api/API';
import routes from '../../constants/routes';
import type { CreateAssetForm } from './types';

export const CreateAsset: React.FC = () => {
  const { requestOptions } = useContext(AxisContext);
  const { selectedAccount } = useContext(AccountContext);
  const navigate = useNavigate();

  const [assetData, setAssetData] = useState<CreateAssetForm>({
    name: '',
    type: '',
    operatingSystem: '',
    status: '',
    tlp: '',
    priority: 0,
    parentAssetId: undefined,
    assetGroupId: undefined,
  });

  const onChangeField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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

    console.log('Submitting asset:', payload);

    API.assets(requestOptions)
      .create(payload)
      .then((res) => {
        console.log(res);
        navigate(
          routes.platform.manageAsset.replace(
            ':id',
            res.data.responseObject.id,
          ),
        );
      })
      .catch((err) => {
        console.error('Error creating asset:', err);
      });
  };

  // TLP color options
  const tlpOptions = ['white', 'green', 'amber', 'red'];
  // Status options
  const statusOptions = ['active', 'inactive', 'maintenance', 'decommissioned'];
  // Operating system options
  const osOptions = ['Windows', 'macOS', 'Linux', 'iOS', 'Android', 'Other'];

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <h1 className='text-2xl font-bold my-5'>Create New Asset</h1>
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
              <p className='block text-sm font-medium text-gray-700'>
                Asset Type
              </p>
              <select
                name='type'
                onChange={onChangeField}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              >
                <option value=''>Select Asset Type</option>
                <option value='Server'>Server</option>
                <option value='Workstation'>Workstation</option>
                <option value='Mobile'>Mobile Device</option>
                <option value='IoT'>IoT Device</option>
                <option value='Network'>Network Device</option>
              </select>
            </div>

            <div className='w-full'>
              <p className='block text-sm font-medium text-gray-700'>
                Operating System
              </p>
              <select
                name='operatingSystem'
                onChange={onChangeField}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              >
                <option value=''>Select Operating System</option>
                {osOptions.map((os) => (
                  <option key={os} value={os}>
                    {os}
                  </option>
                ))}
              </select>
            </div>

            <div className='w-full'>
              <p className='block text-sm font-medium text-gray-700'>Status</p>
              <select
                name='status'
                onChange={onChangeField}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              >
                <option value=''>Select Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className='w-full'>
              <Input
                name='priority'
                label='Priority (1-5)'
                type='number'
                onChange={onChangeField}
                inputClasses={'min-w-52'}
              />
            </div>

            <div className='w-full'>
              <p className='block text-sm font-medium text-gray-700'>
                Traffic Light Protocol (TLP)
              </p>
              <select
                name='tlp'
                onChange={onChangeField}
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              >
                <option value=''>Select TLP</option>
                {tlpOptions.map((tlp) => (
                  <option key={tlp} value={tlp}>
                    {tlp.charAt(0).toUpperCase() + tlp.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className='w-full'>
              <Input
                name='parentAssetId'
                label='Parent Asset (optional)'
                type='number'
                onChange={onChangeField}
                inputClasses={'min-w-52'}
              />

              <Input
                name='assetGroupId'
                label='Asset Group (optional)'
                type='number'
                onChange={onChangeField}
                inputClasses={'min-w-52 w-100'}
              />
            </div>

            <Button type={'submit'} text={'Create'} theme={'primary'} />
          </form>
        </div>
      </div>
    </div>
  );
};
