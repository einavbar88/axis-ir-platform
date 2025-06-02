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
import { chartsBgColors } from '../constants/common';
import { TimeFrameSelector } from '../components/ui/TimeFrameSelector';

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
    let infectedAssetsFromDb = [];

    try {
      const incidentsResults = await API.incidents(requestOptions).getIncidents(
        selectedAccount.value,
        timeFrame,
      );
      incidentsFromDb = incidentsResults.data.responseObject;
    } catch (e) {}

    const incidentCountsByTime = groupByTimeScale(incidentsFromDb, 'openedAt');
    setIncidents(prepareChartData(incidentCountsByTime, 'Incidents', 0));

    try {
      const tasksResults = await API.tasks(requestOptions).getAllTasks(
        incidentsFromDb.map((incident: Incident) => incident.caseId),
      );
      tasksFromDb = tasksResults.data.responseObject;
    } catch (e) {}

    const taskCountsByTime = groupByTimeScale(tasksFromDb, 'createdAt');
    setTasks(prepareChartData(taskCountsByTime, 'Tasks', 1));

    try {
      const assetsResults = await API.incidents(requestOptions).getIoc(
        incidentsFromDb.map((incident: Incident) => incident.caseId),
        timeFrame,
      );
      iocFromDb = assetsResults.data.responseObject;
      infectedAssetsFromDb = iocFromDb.reduce((acc: any[], curr: any) => {
        const exists = acc.some((item) => item.assetId === curr.assetId);
        if (!exists) acc.push(curr);
        return acc;
      }, []);
    } catch (e) {}

    const iocCountByTime = groupByTimeScale(iocFromDb, 'createdAt');
    const assetsCountByTime = groupByTimeScale(
      infectedAssetsFromDb,
      'createdAt',
    );
    setIoc(prepareChartData(iocCountByTime, 'IOC', 2));
    setInfectedAssets(
      prepareChartData(assetsCountByTime, 'Infected Assets', 3),
    );
  };

  const groupByTimeScale = (data: any[], dateField: string) => {
    const timeCounts: { [key: string]: number } = {};

    data?.forEach((item) => {
      const date = new Date(item[dateField]);
      let key = '';

      switch (timeScale) {
        case 'day':
          key = date.toISOString().split('T')[0];
          break;

        case 'month':
          key = `${date.getFullYear()}-${date.toLocaleString('default', { month: 'short' })}`;
          break;

        case 'year':
          key = `${date.getFullYear()}`;
          break;

        default:
          key = date.toISOString().split('T')[0];
      }

      timeCounts[key] = (timeCounts[key] || 0) + 1;
    });

    return timeCounts;
  };

  const prepareChartData = (
    data: { [key: string]: number },
    label: string,
    theme: number,
  ) => {
    const labels = Object.keys(data);
    const counts = Object.values(data);
    return {
      labels,
      datasets: [
        {
          label,
          data: counts,
          backgroundColor: chartsBgColors[theme],
          borderColor: chartsBgColors[theme].replace('0.6', '1'),
          borderWidth: 1,
        },
      ],
    };
  };

  useEffect(() => {
    if (selectedAccount?.value) {
      getDataForAccount();
    }
  }, [selectedAccount, timeScale, timeFrame]);

  const timeScales = ['day', 'month', 'year'];

  return selectedAccount ? (
    <div className='w-full h-full flex flex-col'>
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
