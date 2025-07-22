import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apiBaseURL from "../api/axios";

interface ILeaveRequest {
    _id: string;
    employeeID: string;
    leaveType: string;
    reason: string;
    fromDate: string;
    toDate: string;
    noOfDays: number,
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number
}

interface IInitialState {
    loading: boolean;
    leaveRequests: ILeaveRequest[];
}

const initialState: IInitialState = {
    loading: false,
    leaveRequests: [],}

export const getAllEmployeeLeaveRequest = createAsyncThunk<any, { id: string }>(
    "user/getAllEmployee",
    async ({ id }, thunkAPI) => {
        try {
            const response = await apiBaseURL.get(`leave-request/${id}`);
            return response.data;
        } catch (error) {
            const errMsg = axios.isAxiosError(error) && error.message ? error.response?.data.message : "An unexpected error occured";
            return thunkAPI.rejectWithValue(errMsg);
        }
    }
);

export const getAllEmployeeLeaveRequestWithoutID = createAsyncThunk<any>(
    "user/getAllEmployeeWithoutID",
    async (_, thunkAPI) => {
        try {
            const response = await apiBaseURL.get(`leave-request`);
            return response.data;
        } catch (error) {
            const errMsg = axios.isAxiosError(error) && error.message ? error.response?.data.message : "An unexpected error occured";
            return thunkAPI.rejectWithValue(errMsg);
        }
    }
);

export const createEmployeeLeaveRequest = createAsyncThunk<any, { employeeID: string, leaveType: string, reason: string, fromDate: string, toDate: string, enqueueSnackbar: (msg: string, options?: object) => void }>(
    "employee/createLeaveRequest",
    async ({ employeeID, leaveType, reason, fromDate, toDate, enqueueSnackbar }, thunkAPI) => {
        try {
            const response = await apiBaseURL.post(`leave-request/create`, { employeeID, leaveType, reason, fromDate, toDate });
            enqueueSnackbar(response.data.message, { variant: "success" });
             thunkAPI.dispatch(getAllEmployeeLeaveRequest({ id: employeeID }));
            return response.data?.users;
        } catch (error) {
            const errMsg = axios.isAxiosError(error) && error.message ? error.response?.data.message : "An unexpected error occured";
            enqueueSnackbar(errMsg, { variant: "error" });
            return thunkAPI.rejectWithValue(errMsg);
        }
    }
);

export const updateEmployeeLeaveRequest = createAsyncThunk<any, {id: string, employeeID: string, leaveType: string, reason: string, fromDate: string, toDate: string, enqueueSnackbar: (msg: string, options?: object) => void }>(
    "employee/updateLeaveRequest",
    async ({ id,employeeID, leaveType, reason, fromDate, toDate, enqueueSnackbar }, thunkAPI) => {
        try {
            const response = await apiBaseURL.put(`leave-request/update/${id}`, { leaveType, reason, fromDate, toDate });
            enqueueSnackbar(response.data.message, { variant: "success" });
             thunkAPI.dispatch(getAllEmployeeLeaveRequest({ id: employeeID }));
            return response.data?.users;
        } catch (error) {
            const errMsg = axios.isAxiosError(error) && error.message ? error.response?.data.message : "An unexpected error occured";
            enqueueSnackbar(errMsg, { variant: "error" });
            return thunkAPI.rejectWithValue(errMsg);
        }
    }
);

export const updateEmployeeLeaveRequestByAdmin = createAsyncThunk<any, {id: string, status: string, enqueueSnackbar: (msg: string, options?: object) => void }>(
    "employee/updateEmployeeLeaveRequestByAdmin",
    async ({ id,status, enqueueSnackbar }, thunkAPI) => {
        try {
            const response = await apiBaseURL.put(`leave-request/update-by-admin/${id}`, { status });
            enqueueSnackbar(response.data.message, { variant: "success" });
             thunkAPI.dispatch(getAllEmployeeLeaveRequestWithoutID());
            return response.data?.users;
        } catch (error) {
            const errMsg = axios.isAxiosError(error) && error.message ? error.response?.data.message : "An unexpected error occured";
            enqueueSnackbar(errMsg, { variant: "error" });
            return thunkAPI.rejectWithValue(errMsg);
        }
    }
);

export const deleteEmployeeRequest = createAsyncThunk<any, { id: string, employeeID: string, enqueueSnackbar: (msg: string, options?: object) => void }>(
    "employee/deleteLeaveRequest",
    async ({ id, employeeID, enqueueSnackbar }, thunkAPI) => {
        try {
            const response = await apiBaseURL.delete(`leave-request/${id}`);
            enqueueSnackbar(response.data.message, { variant: "success" });
            thunkAPI.dispatch(getAllEmployeeLeaveRequest({ id: employeeID }));
            return response.data;
        } catch (error) {
            const errMsg = axios.isAxiosError(error) && error.message ? error.response?.data.message : "An unexpected error occured";
            enqueueSnackbar(errMsg, { variant: "error" });
            return thunkAPI.rejectWithValue(errMsg);
        }
    }
)

const profileSlice = createSlice({
    name: "employeeLeaveRequest",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllEmployeeLeaveRequest.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllEmployeeLeaveRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.leaveRequests = action.payload.data;
            })
            .addCase(getAllEmployeeLeaveRequest.rejected, (state) => {
                state.loading = false;
                state.leaveRequests = []
            })
             .addCase(getAllEmployeeLeaveRequestWithoutID.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllEmployeeLeaveRequestWithoutID.fulfilled, (state, action) => {
                state.loading = false;
                state.leaveRequests = action.payload.data;
            })
            .addCase(getAllEmployeeLeaveRequestWithoutID.rejected, (state) => {
                state.loading = false;
                state.leaveRequests = []
            })
    }
});

export default profileSlice.reducer;