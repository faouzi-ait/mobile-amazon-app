import { apiSlice } from "../apiBaseService/baseApiQuery";

export const apiMemo = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMemos: builder.query({
            query: () => '/memos',
            keepUnusedDataFor: 5,
        })
    }),
    onError: (error /*, { dispatch, getState }*/) => {
        console.error('Global error handler:', error);
    },
})

export const { useGetMemosQuery } = apiMemo