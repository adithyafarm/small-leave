import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiBaseURL from "../api/axios";
import axios from "axios";

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
    user: IUser | null;
    isLoggedIn: boolean;
    loading: boolean;
    error: string | null;
    message: string | null;
    role: "employee" | "admin";
    token: string;
}

const initialState: IInitialState = {
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null,
    message: null,
    role: "employee",
    token: ""
}

export const loginUser = createAsyncThunk<
    any,
    { email: string; password: string; enqueueSnackbar: (msg: string, options?: object) => void },
    { rejectValue: string }
>(
    "auth/login",
    async ({ email, password, enqueueSnackbar }, thunkAPI) => {
        try {
            const response = await apiBaseURL.post('auth/login', { email, password });
            enqueueSnackbar(response.data.message, { variant: "success" });
            return response.data;
        } catch (error) {
             const errMsg = axios.isAxiosError(error) && error.message ? error.response?.data.message : "An unexpected error occured";
            enqueueSnackbar(errMsg, { variant: "error" })
            return thunkAPI.rejectWithValue(errMsg);
        }
    }
);

export const registerUser = createAsyncThunk<any, { email: string, password: string, username?: string; enqueueSnackbar: (msg: string, options?: object) => void }>(
    'auth/register',
    async ({ email, password, username, enqueueSnackbar }, thunkAPI) => {
        try {
            const response = await apiBaseURL.post('/auth/register', { email, password, name: username });
            enqueueSnackbar(response.data.message, { variant: "success" });
            return response.data;
        } catch (error) {
            const errMsg = axios.isAxiosError(error) && error.message ? error.response?.data.message : "An unexpected error occured";
            enqueueSnackbar(errMsg, { variant: "error" })
            return thunkAPI.rejectWithValue(errMsg);
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.isLoggedIn = false;
            state.role = "employee";
            state.message = null;
            state.error = null;
        },
        loggedIn(state) {
            state.isLoggedIn = true
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload.user,
                    state.message = action.payload.message,
                    state.loading = false,
                    state.role = action.payload.user.role,
                    state.token = action.payload.token
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload as string,
                    state.loading = false
            })

            // register
            .addCase(registerUser.pending, (state) => {
                state.loading = true,
                    state.user = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false,
                    state.error = null,
                    state.message = action.payload.message,
                    state.user = action.payload.user
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload as string,
                    state.message = null
            })
    }
});

export const { logout, loggedIn } = authSlice.actions;
export default authSlice.reducer;