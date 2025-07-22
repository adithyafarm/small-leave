import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Box, Button, IconButton, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteEmployee, getAllEmployee, updateEmployee } from '../../features/employeeSlice';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { useSnackbar } from "notistack";
import EmployeeDetailsModal from './EmployeeDetailsModal';
import DeleteModal from '../modal/DeleteModal';

interface Employee {
    id: number;
    name: string;
    email: string;
    uniqueID: number;
    role?: string;
}

const EmployeeDetailsComp = () => {

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        pageSize: 5,
        page: 0,
    });
    const [open, setOpen] = useState(false);
    const [deleteOpenModal, setDeleteModal] = useState(false);
    const [editModalFunc, setEditModalFunc] = useState<Employee>();
    const [rowID, setRowID] = useState<string>("");
    const { user } = useAppSelector(state => state.users);
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        dispatch(getAllEmployee());
    }, []);

    const rows = user?.map((user: any, index: number) => ({
        id: index + 1,
        name: user.name,
        email: user.email,
        uniqueID: user._id,
        role: user.role
    }));

    const handleEdit = (row: Employee) => {
        setEditModalFunc(row);
        setOpen(true);
    };

    const handleEditFunc = (payload: any) => {
        if(editModalFunc?.uniqueID && payload?.name && payload?.email && payload?.role){
            dispatch(updateEmployee({ id: editModalFunc.uniqueID, name: payload.name, email: payload.email, role: payload?.role, enqueueSnackbar }));
        }
    }

    const handleDeleteModal = (row: Employee) => {
        setRowID(row.uniqueID.toString());
        setDeleteModal(true);
    };

    const handleDelete = () => {
        dispatch(deleteEmployee({ id: rowID?.toString(), enqueueSnackbar }));
        setDeleteModal(false)
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
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
        <Box sx={{ height: "", width: '100%' }}>
            <div className='flex justify-end pb-3'>
                <Button variant='contained' sx={{ bgcolor: "#34495e" }} onClick={() => {setOpen(true),setEditModalFunc(undefined)}}>Create</Button>
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
            <EmployeeDetailsModal open={open} onClose={() => setOpen(false)} handleFunc={handleEditFunc} editModalFunc={editModalFunc} />
            <DeleteModal open={deleteOpenModal} onClose={() => setDeleteModal(false)} handleDelete={handleDelete} title={"Employee"} />
        </Box>
    )
}

export default EmployeeDetailsComp