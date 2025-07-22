import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apiBaseURL from "../api/axios";

interface IInitialState {
   loading: boolean;
}

const initialState: IInitialState = {
    loading: false
}

export const updateUserProfile = createAsyncThunk<any, { id?: string, name?: string, email?: string, oldPassword?: string, newPassword?: string, enqueueSnackbar: (msg: string, options?: object) => void }>(
    "user/profile",
    async ({id, name, email, oldPassword, newPassword, enqueueSnackbar}, thunkAPI) => {
        try {
            const response = await apiBaseURL.put(`user/profile/${id}`, { name, email, oldPassword, newPassword });
            enqueueSnackbar(response.data.message, { variant: "success" });
            return response.data?.users;
        } catch (error) {
            const errMsg = axios.isAxiosError(error) && error.message ? error.response?.data.message : "An unexpected error occured";
            enqueueSnackbar(errMsg, { variant: "error" });
            return thunkAPI.rejectWithValue(errMsg);
        }
    }
);

const profileSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserProfile.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateUserProfile.rejected, (state) => {
                state.loading = false;
            })
    }
});

export default profileSlice.reducer;