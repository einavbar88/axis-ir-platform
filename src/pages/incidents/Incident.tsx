import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { API } from '../../api/API';
import { AxisContext } from '../../store/AxisContext';
import type { Incident as IncidentType, Task } from './types';
import { incidentStatusOptions } from '../../constants/common';
import { useIsClickOutside } from '../../hooks/useIsClickOutside';
import { Button } from '../../components/ui/Button';
import { UserSelect } from '../../components/UserSelect';
import { TitleEditModal } from './modals/TitleEditModal';
import { DescriptionEditModal } from './modals/DescriptionEditModal';
import { AddTaskModal } from './modals/AddTaskModal';
import { AccountContext } from '../../store/AccountContext';
import routes from '../../constants/routes';
import { priorities } from '../../constants/common';

export const Incident: React.FC = () => {
  const { requestOptions } = useContext(AxisContext);
  const { accountUsers } = useContext(AccountContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const chosenTask = useRef<Task>(null) as React.MutableRefObject<any>;

  const [incident, setIncident] = useState<IncidentType>();
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [descriptionTooltip, setDescriptionTooltip] = useState(false);

  const addTaskModalRef = useRef<HTMLDivElement>(null);
  const { isOpen: addTaskModalOpen, setIsOpen: setAddTaskModalOpen } =
    useIsClickOutside(addTaskModalRef);

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
      case 'assignee':
        incidentCopy.assignee =
          update.assignee === 'null' ? undefined : update.assignee;
        break;
      case 'priority':
        incidentCopy.priority = update.priority;
        break;
      default:
        break;
    }
    setIncident(incidentCopy);
  };

  const updateTasks = () => {
    setAddTaskModalOpen(false);
    API.tasks(requestOptions)
      .getTasks(Number(id))
      .then((res) => {
        const tasks = res.data.responseObject.map((task: Task) => ({
          ...task,
          assetId: ((task.assetId as string) || '')
            .split(',')
            .map(Number)
            .filter(Boolean),
          assetGroupId: ((task.assetGroupId as string) || '')
            .split(',')
            .filter(Boolean)
            .map(Number),
        }));
        setTasks(tasks);
      })
      .catch((e) => {});
  };

  useEffect(() => {
    API.incidents(requestOptions)
      .getById(Number(id))
      .then((res) => {
        setIncident(res.data.responseObject);
        setDescription(res.data.responseObject.description);
        setTitle(res.data.responseObject.title);
      });
    updateTasks();
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
    <div className='p-8 border border-main-dark rounded bg-main-lightest'>
      {addTaskModalOpen && (
        <AddTaskModal
          ref={addTaskModalRef}
          close={() => setAddTaskModalOpen(false)}
          onSave={updateTasks}
          value={id}
          chosenTask={chosenTask}
          onChange={() => {}}
        />
      )}
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
      <h1 className='text-3xl font-bold mb-4 text-center'>
        <span>Incident #{incident?.caseId} - </span>
        <span
          className='cursor-pointer underline'
          onClick={() => onClickOpenEdit('title')}
        >
          {incident?.title}
        </span>
      </h1>
      <div className='flex w-full'>
        <div className='w-1/3'>
          <p>
            <strong>Opened At</strong>{' '}
            {incident?.openedAt
              ? new Date(incident?.openedAt).toLocaleString('en-IL')
              : '-'}
          </p>
          <br />
          {incident?.status && (
            <>
              <p>
                <strong>Status</strong>{' '}
                <select
                  className={'p-2 bg-transparent'}
                  defaultValue={incident?.status}
                  onChange={(e) =>
                    updateIncident({ status: e.target.value }, 'status')
                  }
                >
                  {incidentStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0) + status.slice(1).toLowerCase()}
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
              value={incident?.priority}
              name={'priority'}
              onChange={(e) =>
                updateIncident({ priority: Number(e.target.value) }, 'priority')
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
              update={(assignee) => updateIncident({ assignee }, 'assignee')}
              defaultValue={incident?.assignee}
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
              className='mt-2 pl-4  h-[130px]  overflow-y-auto'
              // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(incident?.description || ''),
              }}
            />
          </div>
        </div>
      </div>
      <br />
      <div>
        <div className='flex items-center'>
          <strong className='mr-8'>Tasks</strong>
          <Button
            buttonClasses={'mb-0 ml-0'}
            text={'Add Task'}
            theme={'primary'}
            size={'small'}
            onClick={() => setAddTaskModalOpen(true)}
          />
        </div>
        {tasks.length > 0 ? (
          <table className='w-full border mt-4 bg-white'>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.taskId}
                  className={task.status === 'Done' ? 'line-through' : ''}
                >
                  <td className='p-4 w-full border-b border-main-dark-50 flex justify-between hover:bg-main-lightest'>
                    <div
                      className='cursor-pointer'
                      onClick={() => {
                        navigate(
                          routes.platform.task.replace(
                            ':id',
                            task.taskId.toString(),
                          ),
                        );
                      }}
                    >
                      {task.title}
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        chosenTask.current = task;
                        setAddTaskModalOpen(true);
                      }}
                      className='cursor-pointer'
                    >
                      <span className='mr-4 text-main-dark-50'>
                        {task.assignee
                          ? accountUsers.find(
                              (user) => user.value == task.assignee,
                            )?.label
                          : '+ Assign'}
                      </span>
                      <span className='cursor-pointer'>
                        {task.status.charAt(0) +
                          task.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className='m-4 pl-4 text-sm text-main-darkest'>
            No tasks created for this incident yet.
          </p>
        )}
      </div>
    </div>
  );
};
