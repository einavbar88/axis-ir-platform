import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { API } from '../../api/API';
import { AxisContext } from '../../store/AxisContext';
import { useIsClickOutside } from '../../hooks/useIsClickOutside';
import { Button } from '../../components/ui/Button';
import { UserSelect } from '../../components/UserSelect';
import { TitleEditModal } from './modals/TitleEditModal';
import { DescriptionEditModal } from './modals/DescriptionEditModal';
import routes from '../../constants/routes';
import type { Task as TaskType } from './types';
import { incidentStatusOptions, priorities } from '../../constants/common';
import { getVisibleString } from '../helper';

export const Task: React.FC = () => {
  const { requestOptions } = useContext(AxisContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState<TaskType>();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [descriptionTooltip, setDescriptionTooltip] = useState(false);

  const editTitleModalRef = useRef<HTMLDivElement>(null);
  const { isOpen: titleModalOpen, setIsOpen: setTitleModalOpen } =
    useIsClickOutside(editTitleModalRef);

  const editDescriptionModalRef = useRef<HTMLDivElement>(null);
  const { isOpen: descriptionModalOpen, setIsOpen: setDescriptionModalOpen } =
    useIsClickOutside(editTitleModalRef);

  const updateTask = async (
    update: Partial<TaskType>,
    field: keyof TaskType,
  ) => {
    await API.tasks(requestOptions).update({
      taskId: task?.taskId,
      ...update,
    });
    const taskCopy = { ...task };
    switch (field) {
      case 'title':
        taskCopy.title = update.title;
        setTitleModalOpen(false);
        break;
      case 'description':
        taskCopy.description = update.description;
        setDescriptionModalOpen(false);
        break;
      case 'status':
        taskCopy.status = update.status;
        break;
      case 'assignee':
        taskCopy.assignee =
          update.assignee === 'null' ? undefined : update.assignee;
        break;
      case 'priority':
        taskCopy.priority = update.priority;
        break;
      default:
        break;
    }
    setTask(taskCopy as TaskType);
  };

  useEffect(() => {
    API.tasks(requestOptions)
      .getById(Number(id))
      .then((res) => {
        setTask(res.data.responseObject);
        setDescription(res.data.responseObject.description);
        setTitle(res.data.responseObject.title);
      });
  }, [id]);

  const onClickOpenEdit = (field: keyof TaskType) => {
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
    <div className='p-8 border border-main-dark rounded bg-main-lightest'>
      {titleModalOpen && (
        <TitleEditModal
          value={title}
          ref={editTitleModalRef}
          close={() => setTitleModalOpen(false)}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          onSave={() => updateTask({ title }, 'title')}
        />
      )}
      {descriptionModalOpen && (
        <DescriptionEditModal
          value={description}
          ref={editDescriptionModalRef}
          close={() => {
            setDescription(task?.description || '');
            setDescriptionModalOpen(false);
          }}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          onSave={() => updateTask({ description }, 'description')}
        />
      )}
      <div className='w-full flex justify-between items-center mb-8'>
        <Button
          text={'Back to Incident'}
          theme={'secondary'}
          size={'small'}
          onClick={() =>
            navigate(
              routes.platform.incident.replace(
                ':id',
                task?.caseId ? task.caseId.toString() : '',
              ),
            )
          }
        />
        <h1 className='text-3xl font-bold text-center text-main-darkest'>
          <span>Task #{task?.taskId} - </span>
          <span
            className='cursor-pointer underline'
            onClick={() => onClickOpenEdit('title')}
          >
            {task?.title}
          </span>
        </h1>
        <div className='w-[100px] h-1' />
      </div>
      <div className='flex w-full'>
        <div className='w-1/3'>
          <p>
            <strong>Created At</strong>{' '}
            {task?.createdAt
              ? new Date(task?.createdAt).toLocaleString('en-IL')
              : '-'}
          </p>
          <br />
          {task?.status && (
            <>
              <p>
                <strong>Status</strong>{' '}
                <select
                  className={'p-2 bg-transparent'}
                  defaultValue={task?.status}
                  onChange={(e) =>
                    updateTask({ status: e.target.value }, 'status')
                  }
                >
                  {incidentStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {getVisibleString(status)}
                    </option>
                  ))}
                </select>
              </p>
              <br />
            </>
          )}
          <p>
            <strong>Priority</strong>
            <select
              className={'p-2 bg-transparent'}
              value={task?.priority}
              name={'priority'}
              onChange={(e) =>
                updateTask({ priority: Number(e.target.value) }, 'priority')
              }
            >
              {priorities.map((priority, i) => (
                <option key={priority} value={i + 1}>
                  {priority}
                </option>
              ))}
            </select>
          </p>
          <br />
          <p>
            <strong>Assignee</strong>{' '}
            <UserSelect
              update={(assignee) => updateTask({ assignee }, 'assignee')}
              defaultValue={task?.assignee}
            />
          </p>
        </div>
        <div className='relative w-2/3'>
          <strong>Description</strong>
          <div
            onMouseLeave={() => setDescriptionTooltip(false)}
            onMouseEnter={() => setDescriptionTooltip(true)}
            className='border border-main-dark-50 rounded p-4 mt-4 bg-white'
          >
            {descriptionTooltip && (
              <div
                className='absolute -left-10 top-10 cursor-pointer p-1 bg-main-darkest rounded-l text-lg text-main-lightest'
                onClick={() => setDescriptionModalOpen(true)}
              >
                Edit
              </div>
            )}
            <p
              className='mt-2 pl-4 h-[130px] overflow-y-auto'
              // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(task?.description || ''),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
