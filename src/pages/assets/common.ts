import type { GridColDef } from '@mui/x-data-grid';

export const assetsColumns: GridColDef[] = [
  { field: 'assetId', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', minWidth: 200 },
  { field: 'type', headerName: 'Type', width: 130 },
  { field: 'operatingSystem', headerName: 'OS', width: 130 },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
  },
  {
    field: 'tlp',
    headerName: 'TLP',
    width: 100,
  },
  {
    field: 'assetGroupId',
    headerName: 'Asset Groups',
    minWidth: 200,
  },
  {
    field: 'lastHeartbeat',
    headerName: 'Last Heartbeat',
    minWidth: 180,
  },
];
