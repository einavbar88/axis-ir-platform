import React, { useContext, useState } from 'react';
import { AxisContext } from '../../store/AxisContext';
import { AccountContext } from '../../store/AccountContext';
import { useNavigate } from 'react-router-dom';
import type { Incident } from './types';
import { API } from '../../api/API';
import routes from '../../constants/routes';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { incidentStatusOptions, tlpOptions } from '../../constants/common';
import { RichTextEditor } from '../../components/ui/rich-text-editor';
import { priorities } from '../../constants/common';

export const CreateIncident: React.FC = () => {
  const { requestOptions } = useContext(AxisContext);
  const { selectedAccount } = useContext(AccountContext);
  const navigate = useNavigate();

  const [incidentData, setIncidentData] = useState<Incident>({
    title: '',
    description: '',
    status: '',
    tlp: '',
    priority: 1,
  });

  const onChangeField = (e: {
    target: {
      name: string;
      value: string | number | string[] | number[] | undefined;
    };
  }) => {
    const { value, name } = e.target;
    setIncidentData({ ...incidentData, [name]: value });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAccount?.value) {
      console.error('No account selected');
      return;
    }

    const payload: Incident = {
      ...incidentData,
      companyId: Number(selectedAccount?.value),
      openedAt: new Date().toISOString(),
    };

    API.incidents(requestOptions)
      .create(payload)
      .then((res) => {
        navigate(
          routes.platform.incident.replace(
            ':id',
            res.data.responseObject.caseId,
          ),
        );
      })
      .catch((err) => {
        console.error('Error creating asset:', err);
      });
  };

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <h1 className='text-2xl font-bold my-5 text-main-darkest'>
        Create New Incident
      </h1>
      <div className='w-full flex justify-around'>
        <div className='w-1/2'>
          <img alt={'New Asset'} src={routes.assets.incident} />
        </div>
        <div className='w-1/3 flex items-center justify-between bg-main-lightest p-4 rounded-lg'>
          <form
            onSubmit={onSubmit}
            className='flex flex-col items-center w-full space-y-4'
          >
            <div className='w-full'>
              <Input
                name='title'
                label='Title'
                onChange={onChangeField}
                inputClasses={'min-w-52'}
                isRequired
              />
            </div>
            <div className='w-full'>
              <p className='block text-sm font-medium text-gray-800'>
                Description
              </p>
              <RichTextEditor
                name={'description'}
                value={incidentData.description}
                onChange={(e) => onChangeField(e as any)}
              />
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
                {incidentStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className='w-full'>
              <strong>Priority</strong>
              <select name={'priority'} onChange={onChangeField}>
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
                    {tlp.charAt(0) + tlp.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>

            <Button type={'submit'} text={'Create'} theme={'primary'} />
          </form>
        </div>
      </div>
    </div>
  );
};
