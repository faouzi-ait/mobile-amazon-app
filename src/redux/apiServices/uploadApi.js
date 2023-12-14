import { apiSlice } from "../apiBaseService/baseApiQuery";

export const uploadApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        upload: builder.mutation({
            query: (body) => ({
                url: 'album',
                method: 'POST',
                body,
            }),
        }),
    })
})

export const { useUploadMutation } = uploadApi