import { IconButton, Stack } from "@mui/material";
import { DataGrid, type GridColDef, type GridPaginationModel } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { deleteEmployeeRequest, getAllEmployeeLeaveRequest } from "../../features/employeeLeaveRequest";
import { useSnackbar } from "notistack";
import DeleteModal from "../modal/DeleteModal";

interface IProps {
    id: string;
    fromDate: Date;
    toDate: Date;
    reason: string;
    status: string;
    createdAt: string;
    _id: string;
    employeeID: string;
}

interface IRowID {
    id: string;
    employeeID: string
}

const LeaveRequestDatatable = ({ setGetData }: any) => {

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        pageSize: 5,
        page: 0,
    });
    const [deleteOpenModal, setDeleteModal] = useState(false);
    const [rowID, setRowID] = useState<IRowID>({id: "", employeeID: ""});

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'S.No',
            flex: 0.5,
            sortable: false,
            filterable: false,
        },
        { field: 'fromDate', headerName: 'From Date', flex: 1,
            renderCell: (params)=>{
                const rawDate = params.row.fromDate;
                const date = new Date(rawDate);
                const formattedDate = date.toLocaleDateString('en-GB');
                return formattedDate;
            }
         },
        { field: 'toDate', headerName: 'To Date', flex: 1,
            renderCell: (params)=>{
                const rawDate = params.row.toDate;
                const date = new Date(rawDate);
                const formattedDate = date.toLocaleDateString('en-GB');
                return formattedDate;
            } },
        { field: 'reason', headerName: 'Reason', flex: 1 },
        { field: 'status', headerName: 'Status', flex: 1 }, {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <IconButton
                        color="primary"
                        disabled={params.row.status !== "Pending"}
                        onClick={() => handleEdit(params.row)}
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="error"
                        disabled={params.row.status !== "Pending"}
                        onClick={() => handleDeleteModal(params.row)}
                        aria-label="delete"
                    >
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            ),
        }
    ];

    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { leaveRequests } = useAppSelector(state => state.leaveRequest);
    const { enqueueSnackbar } = useSnackbar();

    const rowsWithIndex = (leaveRequests || []).map((row, index) => ({
        ...row,
        id: index + 1 + paginationModel.page * paginationModel.pageSize, // adjust for pagination
    }));

    useEffect(() => {
        if (user?._id) {
            const id = user._id;
            dispatch(getAllEmployeeLeaveRequest({ id }))
        }
    }, [])

    const handleEdit = (row: IProps) => {
        setGetData(row);
    };

    const handleDeleteModal = (row: IProps) => {
        setRowID({id:row._id.toString(),employeeID: row.employeeID});
        setDeleteModal(true);
    };
    
    const handleDelete = () => {
        setDeleteModal(false);
        dispatch(deleteEmployeeRequest({ id: rowID.id, employeeID: rowID.employeeID, enqueueSnackbar }));
    };

    return (
        <div>
            <DataGrid
                rows={rowsWithIndex}
                columns={columns}
                paginationModel={paginationModel}
                getRowId={(row) => row._id}
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
            <DeleteModal open={deleteOpenModal} onClose={() => setDeleteModal(false)} handleDelete={handleDelete} title={"Employee Leave Page"} />
        </div>
    )
}

export default LeaveRequestDatatable