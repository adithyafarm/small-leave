import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apiBaseURL from "../api/axios";

interface ILeaveType {
    _id: string;
    leaveType: string;
    maxDays: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface IInitialState {
    loading: boolean;
    leaveType: ILeaveType[]
}

const initialState: IInitialState = {
    loading: false,
    leaveType: []
}

export const getAllLeaveType = createAsyncThunk<any>(
    "user/getLeaveType",
    async (_, thunkAPI) => {
        try {
            const response = await apiBaseURL.get(`leave-type`);
            return response.data;
        } catch (error) {
            const errMsg = axios.isAxiosError(error) && error.message ? error.response?.data.message : "An unexpected error occured";
            return thunkAPI.rejectWithValue(errMsg);
        }
    }
);

export const createLeaveType = createAsyncThunk<any, { leaveType: string, maxDays: number, enqueueSnackbar: (msg: string, options?: object) => void }>(
    "user/createLeaveType",
    async ({ leaveType, maxDays, enqueueSnackbar }, thunkAPI) => {
        try {
            const response = await apiBaseURL.post(`leave-type/create`, { leaveType, maxDays });
            enqueueSnackbar(response.data.message, { variant: "success" });
            thunkAPI.dispatch(getAllLeaveType());
            return response.data;
        } catch (error) {
            const errMsg = axios.isAxiosError(error) && error.message ? error.response?.data.message : "An unexpected error occured";
            enqueueSnackbar(errMsg, { variant: "error" })
            return thunkAPI.rejectWithValue(errMsg);
        }
    }
);

export const updateLeaveType = createAsyncThunk<any, { leaveType: string, maxDays: number, id: string, enqueueSnackbar: (msg: string, options?: object) => void }>(
    "user/updateLeaveType",
    async ({ id, leaveType, maxDays, enqueueSnackbar }, thunkAPI) => {
        try {
            const response = await apiBaseURL.put(`leave-type/${id}`, { leaveType,maxDays });
            enqueueSnackbar(response.data.message, { variant: "success" });
            thunkAPI.dispatch(getAllLeaveType());
            return response.data;
        } catch (error) {
            const errMsg = axios.isAxiosError(error) && error.message ? error.response?.data.message : "An unexpected error occured";
            enqueueSnackbar(errMsg, { variant: "error" })
            return thunkAPI.rejectWithValue(errMsg);
        }
    }
);

export const deleteLeaveType = createAsyncThunk<any, { id: string, enqueueSnackbar: (msg: string, options?: object) => void }>(
    "user/deleteLeaveType",
    async ({ id, enqueueSnackbar }, thunkAPI) => {
        console.log("id", id);

        try {
            const response = await apiBaseURL.delete(`leave-type/${id}`);
            enqueueSnackbar(response.data.message, { variant: "success" });
            thunkAPI.dispatch(getAllLeaveType());
            return response.data;
        } catch (error) {
            const errMsg = axios.isAxiosError(error) && error.message ? error.response?.data.message : "An unexpected error occured";
            enqueueSnackbar(errMsg, { variant: "error" })
            return thunkAPI.rejectWithValue(errMsg);
        }
    }
)

const profileSlice = createSlice({
    name: "leaveType",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllLeaveType.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllLeaveType.fulfilled, (state, action) => {
                state.loading = false;
                state.leaveType = action.payload?.leaveTypes
            })
            .addCase(getAllLeaveType.rejected, (state) => {
                state.loading = false;
                state.leaveType = [];
            })
    }
});

export default profileSlice.reducer;