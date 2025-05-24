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
import { chartsBgColors, timeFrames } from '../constants/common';

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
  const [infectedAssets, setInfectedAssets] = useState<any>();
  const [timeScale, setTimeScale] = useState<string>('day');
  const [timeFrame, setTimeFrame] = useState<string>('last month');

  const getDataForAccount = async () => {
    if (!selectedAccount?.value) return;
    let incidentsFromDb = [];
    let tasksFromDb = [];
    let infectedAssetsFromDb = [];

    try {
      const incidentsResults = await API.incidents(requestOptions).getIncidents(
        selectedAccount.value,
        timeFrame,
      );
      incidentsFromDb = incidentsResults.data.responseObject;
    } catch (e) {}

    const incidentCountsByMonth = groupByTimeScale(incidentsFromDb, 'openedAt');
    setIncidents(prepareChartData(incidentCountsByMonth, 'Incidents', 1));

    try {
      const tasksResults = await API.tasks(requestOptions).getAllTasks(
        incidentsFromDb.map((incident: Incident) => incident.caseId),
      );
      tasksFromDb = tasksResults.data.responseObject;
    } catch (e) {}

    const taskCountsByMonth = groupByTimeScale(tasksFromDb, 'createdAt');
    setTasks(prepareChartData(taskCountsByMonth, 'Tasks', 2));

    try {
      const assetsResults = await API.assets(requestOptions).getInfectedAssets(
        selectedAccount.value,
        timeFrame,
      );
      infectedAssetsFromDb = assetsResults.data.responseObject;
    } catch (e) {}
  };

  const groupByTimeScale = (data: any[], dateField: string) => {
    const timeCounts: { [key: string]: number } = {};

    data.forEach((item) => {
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
      </div>
      <div className='flex justify-center'>
        {incidents ? (
          <div className='h-[300px] mr-8'>
            <Bar
              data={incidents}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'New incidents' },
                },
              }}
            />
          </div>
        ) : (
          <div>No data!</div>
        )}
        {tasks ? (
          <div className='h-[300px] mr-8'>
            <Bar
              data={tasks}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'New tasks' },
                },
              }}
            />
          </div>
        ) : (
          <div>No data!</div>
        )}
        {infectedAssets ? (
          <div className='h-[300px] mr-8'>
            <Bar
              data={infectedAssets}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Infected assets' },
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
