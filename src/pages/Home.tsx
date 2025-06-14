import React, { useContext, useEffect, useState } from 'react';
import { AxisContext } from '../store/AxisContext';
import { AccountContext } from '../store/AccountContext';
import { NoAccounts } from '../components/no-accounts/NoAccounts';
import { API } from '../api/API';
import type { Incident } from './incidents/types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { TimeFrameSelector } from '../components/ui/TimeFrameSelector';
import {
  groupByTimeScale,
  prepareChartData,
  prepareChartDataMultiDataSets,
} from './helper';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export const Home: React.FC = () => {
  const { user, requestOptions } = useContext(AxisContext);
  const { selectedAccount } = useContext(AccountContext);

  const [incidents, setIncidents] = useState<any>();
  const [tasks, setTasks] = useState<any>();
  const [ioc, setIoc] = useState<any>();
  const [infectedAssets, setInfectedAssets] = useState<any>();
  const [timeScale, setTimeScale] = useState<string>('day');
  const [timeFrame, setTimeFrame] = useState<string>('last month');

  const getDataForAccount = async () => {
    if (!selectedAccount?.value) return;
    let incidentsFromDb = [];
    let tasksFromDb = [];
    let iocFromDb = [];
    let maliciousFromDb = [];
    let infectedAssetsFromDb = [];

    try {
      const incidentsResults = await API.incidents(requestOptions).getIncidents(
        selectedAccount.value,
        timeFrame,
      );
      incidentsFromDb = incidentsResults.data.responseObject;
    } catch (e) {}

    const incidentCountsByTime = groupByTimeScale(
      incidentsFromDb,
      'openedAt',
      timeScale,
    );

    const unassignedIncidentsCountsByTime = groupByTimeScale(
      incidentsFromDb.filter((incident: any) => !incident.assigneeName),
      'openedAt',
      timeScale,
    );

    setIncidents(
      prepareChartDataMultiDataSets(
        [incidentCountsByTime, unassignedIncidentsCountsByTime],
        ['Incidents', 'Unassigned'],
        [0, 6],
      ),
    );

    try {
      const tasksResults = await API.tasks(requestOptions).getAllTasks(
        incidentsFromDb.map((incident: Incident) => incident.caseId),
      );
      tasksFromDb = tasksResults.data.responseObject;
    } catch (e) {}

    const taskCountsByTime = groupByTimeScale(
      tasksFromDb,
      'createdAt',
      timeScale,
    );
    const unassignedTaskCountsByTime = groupByTimeScale(
      tasksFromDb.filter((task: any) => !task.assignee),
      'createdAt',
      timeScale,
    );
    setTasks(
      prepareChartDataMultiDataSets(
        [taskCountsByTime, unassignedTaskCountsByTime],
        ['Tasks', 'Unassigned'],
        [1, 5],
      ),
    );

    try {
      const assetsResults = await API.incidents(requestOptions).getIoc(
        incidentsFromDb.map((incident: Incident) => incident.caseId),
        timeFrame,
      );
      iocFromDb = assetsResults.data.responseObject;
      maliciousFromDb = iocFromDb.filter(
        (ioc: any) => ioc.classification === 'MALICIOUS',
      );
      infectedAssetsFromDb = maliciousFromDb.reduce((acc: any[], curr: any) => {
        const exists = acc.some((item) => item.assetId === curr.assetId);
        if (!exists) acc.push(curr);
        return acc;
      }, []);
    } catch (e) {}

    const maliciousIocByTime = groupByTimeScale(
      maliciousFromDb,
      'detectedAt',
      timeScale,
    );
    const iocCountByTime = groupByTimeScale(iocFromDb, 'detectedAt', timeScale);

    const assetsCountByTime = groupByTimeScale(
      infectedAssetsFromDb,
      'detectedAt',
      timeScale,
    );
    setIoc(
      prepareChartDataMultiDataSets(
        [iocCountByTime, maliciousIocByTime],
        ['IOC', 'Malicious'],
        [2, 3],
      ),
    );
    setInfectedAssets(
      prepareChartData(assetsCountByTime, 'Infected Assets', 4),
    );
  };

  useEffect(() => {
    if (selectedAccount?.value) {
      getDataForAccount();
    }
  }, [selectedAccount, timeScale, timeFrame]);

  const timeScales = ['day', 'month', 'year'];

  return selectedAccount ? (
    <div className='w-full h-full flex flex-col'>
      <h2 className='w-full font-bold text-2xl mb-4 text-main-darkest flex justify-center'>
        {selectedAccount.label}
      </h2>
      <div className='flex justify-center mb-4'>
        <h4>Welcome back, {user?.username}</h4>
      </div>
      <div className='flex justify-center items-center mb-4'>
        <h5 className='mr-2'>View by: </h5>
        <select
          className='bg-main-lightest p-2 rounded mr-5'
          onChange={(e) => setTimeScale(e.target.value)}
        >
          {timeScales.map((frame) => (
            <option key={frame} value={frame}>
              {frame.charAt(0).toUpperCase() + frame.slice(1)}
            </option>
          ))}
        </select>
        <h5 className='mr-2'>Time frame: </h5>
        <TimeFrameSelector timeFrame={timeFrame} setTimeFrame={setTimeFrame} />
      </div>
      <div className='grid grid-cols-2 gap-20'>
        {incidents ? (
          <div className='w-[100%]'>
            <Bar
              data={incidents}
              options={{
                responsive: true,
                scales: {
                  y: {
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
                plugins: {
                  legend: { display: false },
                  title: { display: true, text: 'New incidents' },
                },
              }}
            />
          </div>
        ) : (
          <div>No data!</div>
        )}
        {tasks ? (
          <div className='w-[100%]'>
            <Bar
              data={tasks}
              options={{
                responsive: true,
                scales: {
                  y: {
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
                plugins: {
                  legend: { display: false },
                  title: { display: true, text: 'New tasks' },
                },
              }}
            />
          </div>
        ) : (
          <div>No data!</div>
        )}
        {ioc ? (
          <div className='w-[100%] mr-8'>
            <Bar
              data={ioc}
              options={{
                responsive: true,
                scales: {
                  y: {
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
                plugins: {
                  legend: { display: false },
                  title: { display: true, text: 'IOCs' },
                },
              }}
            />
          </div>
        ) : (
          <div>No data!</div>
        )}
        {infectedAssets ? (
          <div className='w-[100%] mr-8'>
            <Bar
              data={infectedAssets}
              options={{
                responsive: true,
                scales: {
                  y: {
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
                plugins: {
                  legend: { display: false },
                  title: { display: true, text: 'Infected Assets' },
                },
              }}
            />
          </div>
        ) : (
          <div>No data!</div>
        )}
      </div>
    </div>
  ) : (
    <NoAccounts />
  );
};
