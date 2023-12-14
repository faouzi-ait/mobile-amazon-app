import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, setLogout } from '../slices/authSlice';
import { REHYDRATE } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';

const baseQuery = fetchBaseQuery({
    tagTypes: ['User', 'Images'],
    mode: "cors",
    credentials: 'include',
    baseUrl: 'http://192.168.0.147:3000',
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === REHYDRATE) {
            return action.payload[reducerPath]
        }
        if (action.type === REHYDRATE && action.key === 'key used with redux-persist') {
          return action.payload
        }
    },
    prepareHeaders: async (headers) => {
        const token = await AsyncStorage.getItem('token');
        if(token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
  
    console.log('REFRESHING TOKEN.......');
    if (result?.error?.status === 401 || result?.error?.status === 403) {
      try {
          console.log('GETTING TOKEN FROM STORAGE.......');
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
            console.log('GETTING NEW TOKEN USING REFRESH TOKEN.......');
            const refreshResult = await axios.post('http://192.168.0.147:3000/refresh-token', {
                refreshToken,
            });
            
            if (refreshResult.data) { // Update the stored token and credentials
                console.log('ADDING NEW TOKENS IN STORAGE.......');
                const { token, newRefreshToken, user } = refreshResult.data;
                
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('refreshToken', newRefreshToken);

                console.log('ADDING NEW CREDENTIALS IN REDUCERS.......');
                api.dispatch(setCredentials({ user, accessToken: { token, refreshToken: newRefreshToken }}));
                
                console.log('RESENDING ORIGINAL QUERY.......');
                return baseQuery(args, api, extraOptions); // Retry the original query
            }
        }
        api.dispatch(setLogout()); // If refreshing failed or no refresh token is available, logout
        return result;
      } catch (error) {
        console.error('Error refreshing token:', error);
        api.dispatch(setLogout());
        return result;
      }
    }
    return result; // If the response status is not 401 or 403, return the result
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReAuth,
    endpoints: builder => ({}),
});