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
  linkTypeOptions,
  attackPhaseOptions,
} from '../../../constants/common';
import { getVisibleString } from '../../helper';
import { API } from '../../../api/API';
import { AccountContext } from '../../../store/AccountContext';

export const AddIndicatorModal: React.FC<
  EditModalProps & { chosenIndicator?: React.RefObject<Indicator> }
> = ({ ref, value, onSave, close, chosenIndicator }) => {
  const { requestOptions, user } = useContext(AxisContext);
  const { assetsOptions } = useContext(AccountContext);

  const [formData, setFormData] = useState<Indicator>(
    chosenIndicator?.current
      ? chosenIndicator.current
      : {
          assetId: Number(assetsOptions[0].value),
          caseId: Number(value),
          value: '',
          tlp: tlpOptions[0],
          linkType: linkTypeOptions[0],
          classification: indicatorClassificationOptions[0],
          type: indicatorStatusOptions[0],
          confidence: 'LOW',
          attackPhase: 'RECONNAISSANCE',
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
    try {
      const data = { ...formData, classifiedBy: Number(user?.userId) };
      if (chosenIndicator?.current) {
        await API.indicators(requestOptions).update(data);
      } else {
        await API.indicators(requestOptions).create(data);
      }
      onSave();
    } catch (error) {
      console.error('Error saving indicator:', error);
    }
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
          <strong>Asset</strong>
          <select
            name='assetId'
            value={formData.assetId}
            onChange={handleChange}
            className='mt-1 p-2 w-full border rounded'
          >
            {assetsOptions.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
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
          <strong>Link Type</strong>
          <select
            name='linkType'
            value={formData.type}
            onChange={handleChange}
            className='mt-1 p-2 w-full border rounded'
          >
            {linkTypeOptions.map((type) => (
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
            {attackPhaseOptions.map((phase) => (
              <option value={phase} key={phase}>
                {getVisibleString(phase)}
              </option>
            ))}
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
