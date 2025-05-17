import React, { useContext, useEffect, useState } from 'react';
import { AxisContext } from '../store/AxisContext';
import { AccountContext } from '../store/AccountContext';
import { NoAccounts } from '../components/no-accounts/NoAccounts';
import { API } from '../api/API';
import type { Incident, Task } from './incidents/types';

export const Home: React.FC = () => {
  const { user, requestOptions } = useContext(AxisContext);
  const { selectedAccount } = useContext(AccountContext);

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const getDataForAccount = async () => {
    if (!selectedAccount?.value) return;
    const incidentsResults = await API.incidents(requestOptions).getIncidents(
      selectedAccount.value,
    );
    const incidentsFromDb = incidentsResults.data.responseObject;
    if (!incidentsFromDb) return;
    setIncidents(incidentsFromDb);

    const tasksResults = await API.tasks(requestOptions).getAllTasks(
      incidentsFromDb.map((incident: Incident) => incident.caseId),
    );
    setTasks(tasksResults.data.responseObject);
  };

  useEffect(() => {
    if (selectedAccount?.value) {
      getDataForAccount();
    }
  }, [selectedAccount]);

  useEffect(() => {
    console.log(incidents, tasks);
  }, [incidents, tasks]);

  return selectedAccount ? <div>Home</div> : <NoAccounts />;
};
