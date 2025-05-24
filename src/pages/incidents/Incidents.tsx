import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AxisContext } from '../../store/AxisContext';
import { AccountContext } from '../../store/AccountContext';
import { API } from '../../api/API';
import routes from '../../constants/routes';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import type { Incident } from './types';
import { incidentStatusOptions, timeFrames } from '../../constants/common';
import { IncidentCard } from './IncidentCard';

export const Incidents: React.FC = () => {
  const { requestOptions } = useContext(AxisContext);
  const { selectedAccount, assetGroupOptions } = useContext(AccountContext);
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [timeFrame, setTimeFrame] = useState<string>('all time');

  useEffect(() => {
    if (selectedAccount?.value) {
      setLoading(true);
      API.incidents(requestOptions)
        .getIncidents(selectedAccount?.value, timeFrame)
        .then((res) => {
          setIncidents(res.data.responseObject);
          setLoading(false);
        })
        .catch((err: any) => {
          console.error('Error fetching incidents:', err);
          setLoading(false);
          setIncidents([]);
        });
    }
  }, [selectedAccount, requestOptions, assetGroupOptions, timeFrame]);

  return (
    <div className='flex flex-col w-full'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Incidents</h1>
        <select
          className='bg-main-lightest p-2 rounded'
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
        >
          {timeFrames.map((frame) => (
            <option key={frame} value={frame}>
              {frame.charAt(0).toUpperCase() + frame.slice(1)}
            </option>
          ))}
        </select>
        <Link to={routes.platform.createIncident}>
          <Button type='button' text='Create Incident' theme='primary' />
        </Link>
      </div>

      {loading ? (
        <div className='flex justify-center my-20'>
          <Loader />
        </div>
      ) : incidents.length === 0 ? (
        <div className='bg-white rounded-lg shadow p-6 text-center'>
          <h3 className='text-lg font-medium text-gray-900'>
            No incidents found
          </h3>
          <p className='mt-2 text-gray-500'>Start by adding a new incident.</p>
        </div>
      ) : (
        <div className='flex overflow-x-auto'>
          {incidentStatusOptions.map((status, i) => (
            <div key={status} className='flex flex-col'>
              <h3 className='font-semibold text-main-dark mb-5 text-center'>
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </h3>
              <div
                className={`p-4 h-full w-[350px] bg-main-lightest border-y ${i === 0 ? 'border-x' : 'border-r'} border-main-darkest`}
              >
                {incidents
                  .filter((incident: Incident) => incident.status === status)
                  .map((incident: Incident) => (
                    <IncidentCard
                      incident={incident}
                      key={incident.caseId}
                      onClickIncident={() =>
                        navigate(
                          routes.platform.incident.replace(
                            ':id',
                            `${incident.caseId}`,
                          ),
                        )
                      }
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
