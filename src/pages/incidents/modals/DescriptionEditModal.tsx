import React from 'react';
import { AxisIRModal } from '../../../components/ui/AxisIRModal';
import { RichTextEditor } from '../../../components/ui/richTextEditor';
import { Button } from '../../../components/ui/Button';
import type { EditModalProps } from '../types';

export const DescriptionEditModal: React.FC<EditModalProps> = ({
  ref,
  value,
  onSave,
  onChange,
  close,
}) => {
  return (
    <AxisIRModal ref={ref} close={close} title={'Edit Description'}>
      <RichTextEditor
        name={'description'}
        value={value}
        onChange={(e) => onChange(e as any)}
        extraClassName='min-h-40 max-h-[350px] overflow-y-auto'
      />
      <div className='mt-4 flex justify-end'>
        <Button onClick={close} text={'cancel'} theme={'secondary'} />
        <Button onClick={onSave} text={'Save'} theme={'primary'} />
      </div>
    </AxisIRModal>
  );
};
