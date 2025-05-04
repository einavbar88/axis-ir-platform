import React, { useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { API } from '../../api/API';
import { AxisContext } from '../../store/AxisContext';
import type { Incident as IncidentType } from '../assets/types';
import { incidentStatusOptions } from '../../constants/common';
import { AxisIRModal } from '../../components/ui/AxisIRModal';
import { useIsClickOutside } from '../../hooks/useIsClickOutside';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { RichTextEditor } from '../../components/ui/rich-text-editor';

type EditModalProps = {
  ref: React.RefObject<any>;
  close: () => void;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
};

const TitleEditModal: React.FC<EditModalProps> = ({
  ref,
  value,
  onSave,
  onChange,
  close,
}) => {
  return (
    <AxisIRModal ref={ref} close={close} title={'Edit Title'}>
      <Input
        type='text'
        name='title'
        defaultValue={value}
        onChange={onChange}
      />
      <div className='mt-4 flex justify-end'>
        <Button onClick={onSave} text={'Save'} theme={'primary'} />
      </div>
    </AxisIRModal>
  );
};

const DescriptionEditModal: React.FC<EditModalProps> = ({
  ref,
  value,
  onSave,
  onChange,
  close,
}) => {
  return (
    <AxisIRModal ref={ref} close={close} title={'Edit Title'}>
      <RichTextEditor
        name={'description'}
        value={value}
        onChange={(e) => onChange(e as any)}
        extraClassName='min-h-40'
      />{' '}
      <div className='mt-4 flex justify-end'>
        <Button onClick={onSave} text={'Save'} theme={'primary'} />
      </div>
    </AxisIRModal>
  );
};

export const Incident: React.FC = () => {
  const { requestOptions } = useContext(AxisContext);
  const { id } = useParams();
  const [incident, setIncident] = React.useState<IncidentType>();

  const editTitleModalRef = useRef<HTMLDivElement>(null);
  const { isOpen: titleModalOpen, setIsOpen: setTitleModalOpen } =
    useIsClickOutside(editTitleModalRef);

  const editDescriptionModalRef = useRef<HTMLDivElement>(null);
  const { isOpen: descriptionModalOpen, setIsOpen: setDescriptionModalOpen } =
    useIsClickOutside(editTitleModalRef);

  useEffect(() => {
    API.incidents(requestOptions)
      .getById(Number(id))
      .then((res) => {
        setIncident(res.data.responseObject);
      });
  }, [id]);

  const onClickOpenEdit = (field: keyof IncidentType) => {
    switch (field) {
      case 'title':
        setTitleModalOpen(true);
        break;
      case 'description':
        setDescriptionModalOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      {titleModalOpen && (
        <TitleEditModal
          value={incident?.title}
          ref={editTitleModalRef}
          close={() => setTitleModalOpen(false)}
          onChange={(e) => {}}
          onSave={() => {}}
        />
      )}
      {descriptionModalOpen && (
        <DescriptionEditModal
          value={incident?.description}
          ref={editDescriptionModalRef}
          close={() => setDescriptionModalOpen(false)}
          onChange={(e) => {}}
          onSave={() => {}}
        />
      )}
      <h1>
        <span>Incident #{incident?.caseId} - </span>
        <span
          className='cursor-pointer'
          onClick={() => onClickOpenEdit('title')}
        >
          {incident?.title}
        </span>
      </h1>
      <p>
        <strong>Opened At:</strong>{' '}
        {incident?.openedAt
          ? new Date(incident?.openedAt).toLocaleString('en-IL')
          : '-'}
      </p>
      {incident?.status && (
        <p>
          <strong>Status:</strong>{' '}
          <select defaultValue={incident?.status}>
            {incidentStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </p>
      )}
      <div>
        <strong>Description:</strong>
        <p
          className='mt-2 pl-4 cursor-pointer'
          onClick={() => onClickOpenEdit('description')}
        >
          {incident?.description}
        </p>
      </div>
    </div>
  );
};
