import axios from 'axios';
import { REHYDRATE } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { setCredentials, setLogout } from '../slices/authSlice';

import { BASE_API_URL } from '@env'

const baseQuery = fetchBaseQuery({
    mode: "cors",
    credentials: 'include',
    baseUrl: BASE_API_URL,
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
  
    if (result?.error?.status === 401 || result?.error?.status === 403) {
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (refreshToken) {
            const { data } = await axios.post(`${BASE_API_URL}/refresh-token`, {
                refreshToken,
            });
            
            if (data) { // Updates the stored token and credentials
                const { token, newRefreshToken, user } = data;
                
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('refreshToken', newRefreshToken);

                api.dispatch(setCredentials({ user, accessToken: { token, refreshToken: newRefreshToken }}));
                
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
    tagTypes: ['User', 'Images', 'Posts', 'Post', 'Search'],
    endpoints: builder => ({}),
});