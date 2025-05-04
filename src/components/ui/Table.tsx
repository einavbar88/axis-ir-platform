import * as React from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

type Props = {
  rows: any[];
  columns: GridColDef[];
  paginationModel: { page: number; pageSize: number };
  onClickRow?: (row: any) => void;
  disableColumnFilter?: boolean;
  disableColumnMenu?: boolean;
  disableColumnSelector?: boolean;
};

export const DataTable: React.FC<Props> = ({
  rows,
  columns,
  paginationModel,
  onClickRow = (row: any) => {},
  disableColumnSelector,
  disableColumnMenu,
  disableColumnFilter,
}) => {
  return (
    <Paper sx={{ width: '100%' }}>
      <DataGrid
        getRowId={() => Math.random().toString()}
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0 }}
        onRowClick={onClickRow}
        disableColumnFilter={disableColumnSelector}
        disableColumnMenu={disableColumnMenu}
        disableColumnSelector={disableColumnFilter}
      />
    </Paper>
  );
};
