import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook"
import { getAllEmployeeLeaveRequestWithoutID, updateEmployeeLeaveRequestByAdmin } from "../../features/employeeLeaveRequest";
import { DataGrid, type GridColDef, type GridPaginationModel, type GridRenderCellParams } from "@mui/x-data-grid";
import { MenuItem, Select } from "@mui/material";
import { useSnackbar } from "notistack";

const statusOptions = ["Pending", "Approved", "Rejected"];

const AdminLeaveRequest = () => {

  const dispatch = useAppDispatch();
  const { leaveRequests } = useAppSelector(state => state.leaveRequest);
  const updateRows = leaveRequests?.map((val, index) => ({
    id: index + 1,
    ...val
  }));

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(getAllEmployeeLeaveRequestWithoutID());
  }, []);

  const handleStatusChange = async (id: string, value: string) => {
    await dispatch(updateEmployeeLeaveRequestByAdmin({ id, status: value, enqueueSnackbar }));
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "leaveTypeName", headerName: "Leave Type", flex: 1 },
    { field: "reason", headerName: "Reason", flex: 1 },
    { field: "noOfDays", headerName: "Days", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Select
          value={params.row.status}
          onChange={(e) =>
            handleStatusChange(params.row._id, e.target.value as string)
          }
          size="small"
        >
          {statusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: "fromDate", headerName: "From", flex: 1,
      renderCell: (params) => {
        const rawDate = params.row.fromDate;
        const date = new Date(rawDate);
        const formattedDate = date.toLocaleDateString('en-GB');
        return formattedDate;
      }
    },
    {
      field: "toDate", headerName: "To", flex: 1,
      renderCell: (params) => {
        const rawDate = params.row.toDate;
        const date = new Date(rawDate);
        const formattedDate = date.toLocaleDateString('en-GB');
        return formattedDate;
      }
    },
  ];

  return (
    <div>
      <DataGrid
        rows={updateRows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            borderBottom: '1px solid #ccc',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-cell': {
            borderRight: '1px solid #eee',
          },
          '& .MuiDataGrid-row': {
            borderBottom: '1px solid #f0f0f0',
          },
          '& .MuiDataGrid-row.Mui-selected': {
            backgroundColor: 'inherit !important', // remove background highlight
          },
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
            outline: 'none', // remove border outline
          },
        }}
      />
    </div>
  )
}

export default AdminLeaveRequest