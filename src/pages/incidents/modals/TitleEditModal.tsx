import React from 'react';
import { AxisIRModal } from '../../../components/ui/AxisIRModal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import type { EditModalProps } from '../types';

export const TitleEditModal: React.FC<EditModalProps> = ({
  ref,
  value,
  onSave,
  onChange,
  close,
}) => {
  const save = () => {
    if (value?.trim() === '') {
      alert('Title cannot be empty');
      return;
    }
    onSave();
  };

  return (
    <AxisIRModal ref={ref} close={close} title={'Edit Title'}>
      <Input
        type='text'
        name='title'
        defaultValue={value}
        onChange={onChange}
      />
      <div className='mt-4 flex justify-end'>
        <Button onClick={save} text={'Save'} theme={'primary'} />
      </div>
    </AxisIRModal>
  );
};
