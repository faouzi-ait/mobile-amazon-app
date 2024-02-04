import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import * as PER from 'redux-persist';

import { uploadApi, apiSlice, apiCategory } from './apiServices';
import { themeReducer, authReducer } from './slices';

export const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  [apiCategory.reducerPath]: apiCategory.reducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
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
    immutableCheck: false,
    serializableCheck: false,
    // serializableCheck: {
    //   ignoredActions: [PER.FLUSH, PER.REHYDRATE, PER.PAUSE, PER.PERSIST, PER.PURGE, PER.REGISTER],
    // },
  }).concat([apiSlice.middleware, apiCategory.middleware, uploadApi.middleware]),
});

setupListeners(store.dispatch);

export const persistor = PER.persistStore(store);
