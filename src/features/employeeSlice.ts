import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apiBaseURL from "../api/axios";

interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface IInitialState {
    user: IUser[];
    success: boolean;
    message: string;
    loading: boolean;
    error: string | null;
}

const initialState: IInitialState = {
    user: [],
    success: false,
    message: '',
    loading: false,
    error: null
}

export const getAllEmployee = createAsyncThunk<any>(
    "user/getAllEmployee",
    async (_, thunkAPI) => {
        try {
            const response = await apiBaseURL.get('user');
            return response.data?.users;
        } catch (error) {
            const errMsg = axios.isAxiosError(error) && error.message ? error.response?.data.message : "An unexpected error occured";
            return thunkAPI.rejectWithValue(errMsg);
        }
    }
);

export const createEmployee = createAsyncThunk<any, { email?: string, name: string, password: string, role: string, enqueueSnackbar: (msg: string, options?: object) => void }>(
    "user/updateEmployee",
    async ({ email, name, password, role, enqueueSnackbar }, thunkAPI) => {
        try {
            const response = await apiBaseURL.post(`user/create`, { email, name, password, role });
            enqueueSnackbar(response.data.message, { variant: "success" });
            thunkAPI.dispatch(getAllEmployee());
            return response.data;
        } catch (error) {
            const errMsg = axios.isAxiosError(error) && error.message ? error.response?.data.message : "An unexpected error occured";
            enqueueSnackbar(errMsg, { variant: "error" })
            return thunkAPI.rejectWithValue(errMsg);
        }
    }
);

export const updateEmployee = createAsyncThunk<any, { email?: string, id?: number, name: string,role: string, enqueueSnackbar: (msg: string, options?: object) => void }>(
    "user/updateEmployee",
    async ({ email, id, name,role, enqueueSnackbar }, thunkAPI) => {
        try {
            const response = await apiBaseURL.put(`user/${id}`, { email, name,role });
            enqueueSnackbar(response.data.message, { variant: "success" });
            thunkAPI.dispatch(getAllEmployee());
            return response.data;
        } catch (error) {
            const errMsg = axios.isAxiosError(error) && error.message ? error.response?.data.message : "An unexpected error occured";
            enqueueSnackbar(errMsg, { variant: "error" })
            return thunkAPI.rejectWithValue(errMsg);
        }
    }
);

export const deleteEmployee = createAsyncThunk<any, { id: string, enqueueSnackbar: (msg: string, options?: object) => void }>(
    "user/deleteEmployee",
    async ({ id, enqueueSnackbar }, thunkAPI) => {
        try {
            const response = await apiBaseURL.delete(`user/${id}`);
            enqueueSnackbar(response.data.message, { variant: "success" });
            thunkAPI.dispatch(getAllEmployee());
            return response.data;
        } catch (error) {
            const errMsg = axios.isAxiosError(error) && error.message ? error.response?.data.message : "An unexpected error occured";
            enqueueSnackbar(errMsg, { variant: "error" })
            return thunkAPI.rejectWithValue(errMsg);
        }
    }
)

const userSLice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllEmployee.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(getAllEmployee.fulfilled, (state, action) => {
                state.loading = false,
                    state.user = action.payload
            })
            .addCase(getAllEmployee.rejected, (state, action) => {
                state.loading = false,
                    state.user = [],
                    state.error = action.payload as string
            })
    }
});

export default userSLice.reducer;