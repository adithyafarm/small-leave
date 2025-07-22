import { Button, IconButton, Stack } from "@mui/material";
import { DataGrid, type GridColDef, type GridPaginationModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "../modal/DeleteModal";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { useSnackbar } from "notistack";
import LeaveTypeModal from "./LeaveTypeModal";
import { deleteLeaveType, getAllLeaveType, updateLeaveType } from "../../features/leaveTypeSlice";

interface FormValues {
  leaveType: string;
  maxDays: number;
  uniqueID: string;
}

const LeaveTypeComp = () => {

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });
  const [open, setOpen] = useState(false);
  const [rowID, setRowID] = useState<string>("");
  const [deleteOpenModal, setDeleteModal] = useState(false);
  const [editModalFunc, setEditModalFunc] = useState<FormValues>();
  const { enqueueSnackbar } = useSnackbar();
  const { leaveType } = useAppSelector(state=>state.leaveType); 
   
  const dispatch = useAppDispatch();

  useEffect(()=>{
    dispatch(getAllLeaveType());
  },[]);

  const rows = leaveType?.map((user: any, index: number) => ({
        id: index + 1,
        leaveType: user.leaveType,
        maxDays: user.maxDays,
        uniqueID: user._id
    }));

  const handleEdit = (row: FormValues) => {
    setRowID(row.uniqueID.toString());
    setEditModalFunc(row);
    setOpen(true);
  };

  const handleDeleteModal = (row: FormValues) => {
    setRowID(row.uniqueID.toString());
    setDeleteModal(true);
  };

  const handleDelete = () => {
    dispatch(deleteLeaveType({ id: rowID?.toString(), enqueueSnackbar }));
    setDeleteModal(false)
  }

  const handleEditFunc = (payload: any) => {
    if (rowID && payload?.maxDays && payload?.leaveType) {
      if(editModalFunc){
        dispatch(updateLeaveType({ id: rowID,maxDays: payload.maxDays,leaveType:payload.leaveType , enqueueSnackbar }));
      }
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'S.No', flex: 1 },
    { field: 'leaveType', headerName: 'Leave Type', flex: 1 },
    { field: 'maxDays', headerName: 'Max Days', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteModal(params.row)}
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    }
  ];

  return (
    <div>
      <div className='flex justify-end pb-3'>
        <Button variant='contained' sx={{ bgcolor: "#34495e" }} onClick={() => (setEditModalFunc(undefined), setOpen(true))}>Create</Button>
      </div>
      <DataGrid
        rows={rows}
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
      <LeaveTypeModal open={open} onClose={() => setOpen(false)} handleFunc={handleEditFunc} editModalFunc={editModalFunc} />
      <DeleteModal open={deleteOpenModal} onClose={() => setDeleteModal(false)} handleDelete={handleDelete} title={"Leave Type"} />
    </div>
  )
}

export default LeaveTypeComp;