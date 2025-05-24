import React, { useContext, useState } from 'react';
import { priorities } from '../../constants/common';
import type { Incident } from './types';
import routes from '../../constants/routes';
import { AccountContext } from '../../store/AccountContext';
import { API } from '../../api/API';
import { AxisContext } from '../../store/AxisContext';

type Props = {
  incident: Incident;
  onClickIncident: () => void;
};
export const IncidentCard: React.FC<Props> = ({
  incident,
  onClickIncident,
}) => {
  const { requestOptions } = useContext(AxisContext);
  const { accountUsers } = useContext(AccountContext);

  const [incidentData, setIncidentData] = useState<Incident>(incident);
  const { tlp, priority, caseId, assigneeName, title } = incident;
  const tlpColors = {
    RED: 'bg-red text-white',
    AMBER: 'bg-amber text-white',
    GREEN: 'bg-green text-white',
    WHITE: 'bg-white text-black border',
  };

  const onChangeIncident = async (e: React.ChangeEvent<any>) => {
    API.incidents(requestOptions).update({
      caseId: incident.caseId,
      [e.target.name]: e.target.value,
    });
    setIncidentData({ ...incidentData, [e.target.name]: e.target.value });
  };

  return (
    <div className='relative rounded-2xl shadow-lg p-4 pt-2 w-80 bg-white space-y-3 mb-4'>
      <p className='absolute right-4 bottom-4 text-gray-800'>
        {incidentData.caseId}
      </p>
      <h2
        className='text-xl font-semibold text-gray-800 cursor-pointer pb-2'
        onClick={onClickIncident}
      >
        {incidentData.title}
      </h2>
      <div className='flex items-center justify-between'>
        <div
          className={`w-fit px-3 py-1 rounded-full text-xs font-semibold text-red ${tlpColors[incidentData.tlp as keyof typeof tlpColors]}`}
        >
          TLP
        </div>
        <div className='relative'>
          <p className='absolute -top-4 left-1 text-xs'>Priority:</p>
          <select
            value={Number(incidentData.priority)}
            className='p-1 rounded bg-main-lightest'
            onChange={(e) => {
              onChangeIncident({
                ...e,
                target: {
                  value: e.target.value,
                  name: 'priority',
                },
              });
            }}
          >
            {priorities.map((priority, i) => (
              <option key={priority} value={i + 1}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='flex text-main-light'>
        <div className='w-5 h-5 bg-main-dark rounded-full mr-1'>
          <img alt={'user'} src={routes.assets.user} />
        </div>
        {incidentData.assigneeName ? incidentData.assigneeName : 'Unassigned'}
      </div>
    </div>
  );
};
