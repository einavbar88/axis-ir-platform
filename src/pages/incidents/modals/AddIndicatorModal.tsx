import React, { useContext, useState } from 'react';
import { AxisIRModal } from '../../../components/ui/AxisIRModal';
import { Button } from '../../../components/ui/Button';
import type { EditModalProps, Indicator } from '../types';
import { AxisContext } from '../../../store/AxisContext';
import {
  priorities,
  tlpOptions,
  indicatorClassificationOptions,
  indicatorStatusOptions,
} from '../../../constants/common';
import { getVisibleString } from '../../helper';

export const AddIndicatorModal: React.FC<
  EditModalProps & { chosenIndicator?: React.RefObject<Indicator> }
> = ({ ref, value, onSave, close, chosenIndicator }) => {
  const { requestOptions } = useContext(AxisContext);

  const [formData, setFormData] = useState<Indicator>(
    chosenIndicator?.current
      ? chosenIndicator.current
      : {
          caseId: Number(value),
          value: '',
          tlp: '',
          classification: '',
          type: indicatorStatusOptions[0],
          confidence: '',
          attackPhase: '',
          priority: 1,
          detectedAt: new Date().toISOString(),
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

  const handleSave = async () => {
    if (
      formData.value?.trim() === '' ||
      !formData.priority ||
      !formData.tlp ||
      !formData.classification ||
      !formData.type ||
      !formData.confidence ||
      !formData.attackPhase ||
      !formData.detectedAt
    ) {
      alert('Fill all required fields');
      return;
    }

    console.log('Indicator data to be saved:', formData);
    onSave();
  };

  return (
    <AxisIRModal
      ref={ref}
      close={close}
      title={'Add an Indicator'}
      width={'wide'}
    >
      <div className='overflow-y-auto max-h-[420px]'>
        <div className='mb-4'>
          <strong>Value</strong>
          <input
            type='text'
            name='value'
            value={formData.value}
            onChange={handleChange}
            className='mt-1 p-2 w-full border rounded'
            placeholder='Enter indicator value (e.g., IP address, domain, file hash)'
          />
        </div>
        <div className='mb-4'>
          <strong>Type</strong>
          <select
            name='type'
            value={formData.type}
            onChange={handleChange}
            className='mt-1 p-2 w-full border rounded'
          >
            {indicatorStatusOptions.map((type) => (
              <option key={type} value={type}>
                {getVisibleString(type)}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <strong>Classification</strong>
          <select
            name='classification'
            value={formData.classification}
            onChange={handleChange}
            className='mt-1 p-2 w-full border rounded'
          >
            {indicatorClassificationOptions.map((classification) => (
              <option key={classification} value={classification}>
                {getVisibleString(classification)}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <strong>TLP (Traffic Light Protocol)</strong>
          <select
            name='tlp'
            value={formData.tlp}
            onChange={handleChange}
            className='mt-1 p-2 w-full border rounded'
          >
            {tlpOptions.map((tlp) => (
              <option key={tlp} value={tlp}>
                {getVisibleString(tlp)}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <strong>Attack Phase</strong>
          <select
            name='attackPhase'
            value={formData.attackPhase}
            onChange={handleChange}
            className='mt-1 p-2 w-full border rounded'
          >
            <option value='RECONNAISSANCE'>Reconnaissance</option>
            <option value='WEAPONIZATION'>Weaponization</option>
            <option value='DELIVERY'>Delivery</option>
            <option value='EXPLOITATION'>Exploitation</option>
            <option value='INSTALLATION'>Installation</option>
            <option value='COMMAND_AND_CONTROL'>Command and Control</option>
            <option value='ACTIONS_ON_OBJECTIVES'>Actions on Objectives</option>
          </select>
        </div>
        <div className='mb-4'>
          <strong>Confidence</strong>
          <select
            name='confidence'
            value={formData.confidence}
            onChange={handleChange}
            className='mt-1 p-2 w-full border rounded'
          >
            <option value='LOW'>Low</option>
            <option value='MEDIUM'>Medium</option>
            <option value='HIGH'>High</option>
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
            {priorities.map((priority, i) => (
              <option key={priority} value={i + 1}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='mt-4 flex justify-end'>
        <Button onClick={close} text={'Cancel'} theme={'secondary'} />
        <Button onClick={handleSave} text={'Save'} theme={'primary'} />
      </div>
    </AxisIRModal>
  );
};
