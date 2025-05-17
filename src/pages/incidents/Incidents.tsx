import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import type { GridColDef } from '@mui/x-data-grid';
import { AxisContext } from '../../store/AxisContext';
import { AccountContext } from '../../store/AccountContext';
import { API } from '../../api/API';
import routes from '../../constants/routes';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { DataTable } from '../../components/ui/Table';
import type { Incident } from './types';

export const Incidents: React.FC = () => {
  const { requestOptions } = useContext(AxisContext);
  const { selectedAccount, assetGroupOptions } = useContext(AccountContext);
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const columns: GridColDef[] = [
    { field: 'caseId', headerName: 'Case ID', width: 70 },
    { field: 'title', headerName: 'Title', minWidth: 200 },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 300,
      renderCell: (val: { row: Incident }) => {
        const html = DOMPurify.sanitize(val.row.description as string);
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        return <div dangerouslySetInnerHTML={{ __html: html }} />;
      },
    },
    { field: 'status', headerName: 'Status', width: 130 },
    { field: 'priority', headerName: 'Priority', width: 100 },
    { field: 'assigneeName', headerName: 'Assignee', width: 150 },
    { field: 'openedAt', headerName: 'Opened At', minWidth: 180 },
    { field: 'closedAt', headerName: 'Closed At', minWidth: 180 },
    { field: 'tlp', headerName: 'TLP', width: 100 },
  ];

  useEffect(() => {
    if (selectedAccount?.value) {
      setLoading(true);
      API.incidents(requestOptions)
        .getIncidents(selectedAccount?.value)
        .then((res) => {
          setIncidents(res.data.responseObject);
          setLoading(false);
        })
        .catch((err: any) => {
          console.error('Error fetching incidents:', err);
          setLoading(false);
        });
    }
  }, [selectedAccount, requestOptions, assetGroupOptions]);

  return (
    <div className='flex flex-col w-full'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Incidents</h1>
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
        <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
          <DataTable
            columns={columns}
            rows={incidents}
            paginationModel={{ page: 0, pageSize: 10 }}
            onClickRow={(asset) => {
              navigate(
                routes.platform.incident.replace(':id', asset.row.caseId),
              );
            }}
          />
        </div>
      )}
    </div>
  );
};
