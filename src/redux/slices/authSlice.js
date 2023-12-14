/* eslint-disable no-unused-expressions */
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null, token: null, isLoggedIn: false },
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken } = action.payload;

            state.user = user;
            state.token = accessToken;
            state.isLoggedIn = true;
        },
        setLogout: (state, action) => {
            state.user = null;
            state.token = null;
            state.isLoggedIn = false;
        },
    }
})

export const { setCredentials, setLogout } = authSlice.actions;

export default authSlice.reducer

export const selectToken = (state) => state.auth.token;
export const selectCurrentUser = (state) => state.auth.user;
export const isUserLoggedIn = (state) => state.auth.isLoggedIn;