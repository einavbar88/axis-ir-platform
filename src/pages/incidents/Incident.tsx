import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { API } from '../../api/API';
import { AxisContext } from '../../store/AxisContext';
import type { Incident as IncidentType, Indicator, Task } from './types';
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
import { DataTable } from '../../components/ui/Table';
import { iocColumns } from './constants';
import { getVisibleString } from '../helper';
import { AddIndicatorModal } from './modals/AddIndicatorModal';
import { AxisIRModal } from '../../components/ui/AxisIRModal';

export const Incident: React.FC = () => {
  const { requestOptions } = useContext(AxisContext);
  const { accountUsers } = useContext(AccountContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const chosenTask = useRef<Task>(null) as React.MutableRefObject<any>;
  const chosenIndicator = useRef<string>('');

  const [incident, setIncident] = useState<
    IncidentType & { reports?: { s3Path: string; generatedAt: string }[] }
  >();
  const [tasks, setTasks] = useState<any[]>([]);
  const [indicators, setIndicators] = useState<any[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [descriptionTooltip, setDescriptionTooltip] = useState(false);

  const downloadReportModalRef = useRef<HTMLDivElement>(null);
  const {
    isOpen: downloadReportModalOpen,
    setIsOpen: setDownloadReportModalOpen,
  } = useIsClickOutside(downloadReportModalRef);

  const deleteIndicatorModalRef = useRef<HTMLDivElement>(null);
  const {
    isOpen: deleteIndicatorModalOpen,
    setIsOpen: setDeleteIndicatorModalOpen,
  } = useIsClickOutside(deleteIndicatorModalRef);

  const addTaskModalRef = useRef<HTMLDivElement>(null);
  const { isOpen: addTaskModalOpen, setIsOpen: setAddTaskModalOpen } =
    useIsClickOutside(addTaskModalRef);

  const addIocModalRef = useRef<HTMLDivElement>(null);
  const { isOpen: addIocModalOpen, setIsOpen: setAddIocModalOpen } =
    useIsClickOutside(addIocModalRef);

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

  const updateIndicators = () => {
    setAddIocModalOpen(false);
    API.incidents(requestOptions)
      .getIoc([`${id}`], 'all time')
      .then((res) => {
        setIndicators(
          res.data.responseObject.map((ioc: Indicator) => {
            const { priority, attackPhase, confidence, detectedAt, tlp } = ioc;
            const phase = attackPhase?.split('_').join(' ') ?? '';
            return {
              ...ioc,
              tlp: getVisibleString(tlp),
              priority: priorities[priority as number],
              attackPhase: getVisibleString(phase),
              confidence: getVisibleString(confidence),
              detectedAt: new Date(detectedAt).toLocaleString('en-IL'),
            };
          }),
        );
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
      })
      .catch((e) => {});
    API.incidents(requestOptions)
      .getIoc([`${id}`], 'all time')
      .then((res) => {
        setIndicators(
          res.data.responseObject.map((ioc: Indicator) => {
            const { priority, attackPhase, confidence, detectedAt, tlp } = ioc;
            const phase = attackPhase?.split('_').join(' ') ?? '';
            return {
              ...ioc,
              tlp: getVisibleString(tlp),
              priority: priorities[priority as number],
              attackPhase: getVisibleString(phase),
              confidence: getVisibleString(confidence),
              detectedAt: new Date(detectedAt).toLocaleString('en-IL'),
            };
          }),
        );
      })
      .catch((e) => {});
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

  const deleteIndicator = () => {
    if (!chosenIndicator?.current) return;
    API.indicators(requestOptions)
      .delete(Number(chosenIndicator.current))
      .then(() => {
        updateIndicators();
        setDeleteIndicatorModalOpen(false);
      });
  };

  const downloadReport = (e: any) => {
    e.preventDefault();

    const filename = `${incident?.title}.pdf`;
    const url = e.target.url.value;

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadReportModalOpen(false);
  };

  return (
    <div>
      <div className='flex justify-between'>
        <Button
          text={'Back'}
          type={'button'}
          theme={'primary'}
          onClick={() => navigate(routes.platform.incidents)}
        />
        <div className='flex items-center'>
          {(incident?.reports || []).length > 0 && (
            <Button
              text={'Download report'}
              type={'button'}
              theme={'primary'}
              onClick={() => setDownloadReportModalOpen(true)}
            />
          )}
          {/*<Button*/}
          {/*  text={'Generate report'}*/}
          {/*  type={'button'}*/}
          {/*  theme={'primary'}*/}
          {/*  onClick={() =>*/}
          {/*    API.incidents(requestOptions).generateReport(`${id}`)*/}
          {/*  }*/}
          {/*/>*/}
        </div>
      </div>
      <div className='p-8 border border-main-dark rounded bg-main-lightest'>
        {downloadReportModalOpen && (
          <AxisIRModal
            ref={downloadReportModalRef}
            close={() => setDownloadReportModalOpen(false)}
            title={'Download report'}
          >
            <form onSubmit={(e) => downloadReport(e)}>
              <p className='my-5'>Which report would you like to download?</p>
              <select
                name='url'
                className='mb-5 py-4 px-2'
                defaultValue={incident?.reports?.[0]?.s3Path}
              >
                {(incident?.reports || []).map((report) => (
                  <option key={report.s3Path} value={report.s3Path}>
                    {report.generatedAt}
                  </option>
                ))}
              </select>
              <div className={'flex justify-end'}>
                <Button
                  text={'Cancel'}
                  theme={'secondary'}
                  type={'button'}
                  onClick={() => setDownloadReportModalOpen(false)}
                />
                <Button text={'Download'} theme={'primary'} type={'submit'} />
              </div>
            </form>
          </AxisIRModal>
        )}
        {deleteIndicatorModalOpen && (
          <AxisIRModal
            ref={deleteIndicatorModalRef}
            close={() => setDeleteIndicatorModalOpen(false)}
            title={'Delete indicator'}
          >
            <p className='my-5'>
              Are you sure you want to delete this indicator?
            </p>
            <div className={'flex justify-end'}>
              <Button
                text={'Keep'}
                theme={'secondary'}
                onClick={() => setDeleteIndicatorModalOpen(false)}
              />
              <Button
                text={'Yes, delete'}
                theme={'primary'}
                onClick={deleteIndicator}
              />
            </div>
          </AxisIRModal>
        )}
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
        {addIocModalOpen && (
          <AddIndicatorModal
            ref={addIocModalRef}
            close={() => setAddIocModalOpen(false)}
            onSave={updateIndicators}
            value={id}
            chosenIndicator={undefined}
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
        <h1 className='text-3xl font-bold mb-4 text-center text-main-darkest'>
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
                value={incident?.priority}
                name={'priority'}
                onChange={(e) =>
                  updateIncident(
                    { priority: Number(e.target.value) },
                    'priority',
                  )
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
            <div className='max-h-[200px] overflow-y-auto mt-4'>
              <table className='w-full border bg-white'>
                <tbody className='max-h-[200px] overflow-y-auto'>
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
                            {getVisibleString(task.status)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className='m-4 pl-4 text-sm text-main-darkest'>
              No tasks created for this incident yet.
            </p>
          )}
        </div>
        <br />
        <div>
          <div className='flex items-center'>
            <strong className='mr-8'>IOCs</strong>
            <Button
              buttonClasses={'mb-0 ml-0'}
              text={'Add IOC'}
              theme={'primary'}
              size={'small'}
              onClick={() => {
                setAddIocModalOpen(true);
              }}
            />
          </div>
          {indicators.length > 0 ? (
            <DataTable
              rows={indicators}
              columns={iocColumns}
              paginationModel={{ pageSize: 10, page: 0 }}
              onClickRow={({ row }) => {
                chosenIndicator.current = row.iocId;
                setDeleteIndicatorModalOpen(true);
              }}
            />
          ) : (
            <p className='m-4 pl-4 text-sm text-main-darkest'>
              No IOCs for this incident yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
