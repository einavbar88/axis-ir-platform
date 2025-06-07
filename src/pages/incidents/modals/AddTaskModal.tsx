import React, { useContext, useState } from 'react';
import Select from 'react-select';
import { AxisIRModal } from '../../../components/ui/AxisIRModal';
import { Button } from '../../../components/ui/Button';
import type { EditModalProps, Task } from '../types';
import { RichTextEditor } from '../../../components/ui/rich-text-editor';
import { AxisContext } from '../../../store/AxisContext';
import { AccountContext } from '../../../store/AccountContext';
import { UserSelect } from '../../../components/UserSelect';
import { API } from '../../../api/API';
import { incidentStatusOptions, priorities } from '../../../constants/common';
import { getVisibleString } from '../../helper';

export const AddTaskModal: React.FC<
  EditModalProps & { chosenTask?: React.RefObject<Task> }
> = ({ ref, value, onSave, close, chosenTask }) => {
  const { requestOptions } = useContext(AxisContext);
  const { assetsOptions, assetGroupOptions } = useContext(AccountContext);

  const [formData, setFormData] = useState<Task>(
    chosenTask?.current
      ? chosenTask.current
      : {
          title: '',
          description: '',
          status: 'NEW',
          assignee: undefined,
          caseId: Number(value),
          assetId: [],
          assetGroupId: [],
          priority: undefined,
          dueDate: undefined,
        },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changeAssetsOrGroups = (
    field: 'assetId' | 'assetGroupId',
    value: string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const changeAssignee = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      assignee: value,
    }));
  };

  const handleSave = async () => {
    if (
      formData.title.trim() === '' ||
      !formData.priority ||
      !formData.status
    ) {
      alert('Fill all required fields');
      return;
    }
    await API.tasks(requestOptions).create({
      ...formData,
      assetGroupId: (formData.assetGroupId as number[])?.join(','),
      assetId: (formData.assetId as number[]).join(','),
    });
    onSave();
  };

  return (
    <AxisIRModal ref={ref} close={close} title={'Add a Task'} width={'wide'}>
      <div className='overflow-y-auto max-h-[420px]'>
        <div className='mb-4'>
          <strong>Title</strong>
          <input
            type='text'
            name='title'
            value={formData.title}
            onChange={handleChange}
            className='mt-1 p-2 w-full border rounded'
          />
        </div>
        <div className='mb-4'>
          <strong>Description</strong>
          <RichTextEditor
            name={'description'}
            value={formData.description}
            onChange={handleChange}
            extraClassName='min-h-40 max-h-[350px] overflow-y-auto'
          />
        </div>
        <div className='mb-4'>
          <strong>Assignee (optional)</strong>
          <span className='bg-white ml-2 py-2 border rounded'>
            <UserSelect
              update={changeAssignee}
              defaultValue={formData.assignee}
            />
          </span>
        </div>
        <div className={'mb-4'}>
          <strong>Status</strong>{' '}
          <select
            name='status'
            className={'p-2 bg-transparent bg-white border rounded'}
            defaultValue={formData?.status}
            onChange={handleChange}
          >
            {incidentStatusOptions.map((status) => (
              <option key={status} value={status}>
                {getVisibleString(status)}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <strong>Priority</strong>
          <select
            name='priority'
            value={formData.priority}
            onChange={handleChange}
            className='mt-1 p-2 w-full border rounded'
          >
            <option value=''>Select priority</option>
            {priorities.map((priority, i) => (
              <option key={priority} value={i + 1}>
                {priority}
              </option>
            ))}
          </select>
        </div>
        <div className='w-full mb-4'>
          <strong>Assets (optional)</strong>
          <Select
            required
            isMulti
            name='assetId'
            options={assetsOptions}
            defaultValue={assetsOptions.filter((option) =>
              (formData.assetId as number[]).includes(Number(option.value)),
            )}
            isClearable={false}
            onChange={(newValue) =>
              changeAssetsOrGroups(
                'assetId',
                newValue.map((v) => v.value),
              )
            }
          />
        </div>
        <div className='w-full mb-12'>
          <strong>Asset Groups (optional)</strong>
          <Select
            required
            isMulti
            name='assetGroupId'
            defaultValue={assetGroupOptions.filter((option) =>
              (formData.assetGroupId as number[]).includes(
                Number(option.value),
              ),
            )}
            options={assetGroupOptions}
            isClearable={false}
            onChange={(newValue) =>
              changeAssetsOrGroups(
                'assetGroupId',
                newValue.map((v) => v.value),
              )
            }
          />
        </div>
      </div>
      <div className='mt-4 flex justify-end'>
        <Button onClick={close} text={'cancel'} theme={'secondary'} />
        <Button onClick={handleSave} text={'Save'} theme={'primary'} />
      </div>
    </AxisIRModal>
  );
};
