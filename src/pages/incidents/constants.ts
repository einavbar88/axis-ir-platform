import type { GridColDef } from '@mui/x-data-grid';

export const iocColumns: GridColDef[] = [
  { field: 'iocId', headerName: 'ID', width: 70 },
  { field: 'priority', headerName: 'Priority', width: 70 },
  { field: 'classification', headerName: 'Classification', width: 150 },
  { field: 'tlp', headerName: 'TLP', width: 70 },
  { field: 'attackPhase', headerName: 'Phase', minWidth: 150 },
  { field: 'confidence', headerName: 'Confidence', minWidth: 150 },
  { field: 'value', headerName: 'Value', minWidth: 300 },
  { field: 'detectedAt', headerName: 'Detected at', minWidth: 200 },
];
