import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { API } from '../../api/API';
import { AxisContext } from '../../store/AxisContext';
import type { Incident as IncidentType } from '../assets/types';
import { incidentStatusOptions } from '../../constants/common';
import { AxisIRModal } from '../../components/ui/AxisIRModal';
import { useIsClickOutside } from '../../hooks/useIsClickOutside';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { RichTextEditor } from '../../components/ui/rich-text-editor';
import { UserSelect } from '../../components/UserSelect';

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

const DescriptionEditModal: React.FC<EditModalProps> = ({
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

export const Incident: React.FC = () => {
  const { requestOptions } = useContext(AxisContext);
  const { id } = useParams();

  const [incident, setIncident] = useState<IncidentType>();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [descriptionTooltip, setDescriptionTooltip] = useState(false);

  const editTitleModalRef = useRef<HTMLDivElement>(null);
  const { isOpen: titleModalOpen, setIsOpen: setTitleModalOpen } =
    useIsClickOutside(editTitleModalRef);

  const editDescriptionModalRef = useRef<HTMLDivElement>(null);
  const { isOpen: descriptionModalOpen, setIsOpen: setDescriptionModalOpen } =
    useIsClickOutside(editTitleModalRef);

  const updateIncident = async (
    update: Partial<IncidentType>,
    field: keyof IncidentType,
  ) => {
    await API.incidents(requestOptions).update({
      caseId: incident?.caseId,
      ...update,
    });
    const incidentCopy = { ...incident };
    switch (field) {
      case 'title':
        incidentCopy.title = update.title;
        setTitleModalOpen(false);
        break;
      case 'description':
        incidentCopy.description = update.description;
        setDescriptionModalOpen(false);
        break;
      case 'status':
        incidentCopy.status = update.status;
        break;
      case 'assignee': {
        incidentCopy.assignee =
          update.assignee === 'null' ? undefined : update.assignee;
        break;
      }
      default:
        break;
    }
    setIncident(incidentCopy);
  };

  useEffect(() => {
    API.incidents(requestOptions)
      .getById(Number(id))
      .then((res) => {
        setIncident(res.data.responseObject);
        setDescription(res.data.responseObject.description);
        setTitle(res.data.responseObject.title);
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
          value={title}
          ref={editTitleModalRef}
          close={() => setTitleModalOpen(false)}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          onSave={() => updateIncident({ title }, 'title')}
        />
      )}
      {descriptionModalOpen && (
        <DescriptionEditModal
          value={description}
          ref={editDescriptionModalRef}
          close={() => {
            setDescription(incident?.description || '');
            setDescriptionModalOpen(false);
          }}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          onSave={() => updateIncident({ description }, 'description')}
        />
      )}
      <h1 className='text-2xl font-bold mb-4'>
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
      <br />
      {incident?.status && (
        <>
          <p>
            <strong>Status:</strong>{' '}
            <select
              defaultValue={incident?.status}
              onChange={(e) =>
                updateIncident({ status: e.target.value }, 'status')
              }
            >
              {incidentStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </p>
          <br />
        </>
      )}
      <p>
        <strong>Priority:</strong> {incident?.priority}
      </p>
      <br />
      <p>
        <strong>Assignee:</strong>{' '}
        <UserSelect
          update={(assignee) => updateIncident({ assignee }, 'assignee')}
          defaultValue={incident?.assignee}
        />
      </p>
      <br />
      <div className='relative'>
        <strong>Description:</strong>
        <div
          onMouseLeave={() => setDescriptionTooltip(false)}
          onMouseEnter={() => setDescriptionTooltip(true)}
          className='border border-main-dark-50 rounded p-4 mt-4'
        >
          {descriptionTooltip && (
            <div
              className='absolute left-28 -top-1 cursor-pointer p-2 bg-main-lightest rounded text-lg'
              onClick={() => setDescriptionModalOpen(true)}
            >
              edit
            </div>
          )}
          <p
            className='mt-2 pl-4'
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(incident?.description || ''),
            }}
          />
        </div>
      </div>
      <br />
      <div>
        <strong>Tasks:</strong>{' '}
      </div>
    </div>
  );
};
