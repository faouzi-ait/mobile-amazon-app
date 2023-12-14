import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupListeners } from '@reduxjs/toolkit/query';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import * as PER from 'redux-persist';

import { apiMemo } from './apiServices/memoApi';
import { apiSlice } from './apiBaseService/baseApiQuery';
import { uploadApi } from './apiServices/uploadApi';

import counterReducer from './slices/counterSlice';
import authReducer from './slices/authSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  counter: counterReducer,
  [apiMemo.reducerPath]: apiMemo.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  // [uploadApi.reducerPath]: uploadApi.reducer,
});

export const persistConfig = {
  storage: AsyncStorage,
  key: 'root',
};

const persistedReducer = PER.persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [PER.FLUSH, PER.REHYDRATE, PER.PAUSE, PER.PERSIST, PER.PURGE, PER.REGISTER],
    },
  }).concat([apiSlice.middleware, apiMemo.middleware, uploadApi.middleware]),
});

setupListeners(store.dispatch);

export const persistor = PER.persistStore(store);
