import { apiSlice } from "../apiBaseService/baseApiQuery";

export const authApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: 'login',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        createUser: builder.mutation({
            query: (body) => ({
              url: 'register',
              method: 'POST',
              body,
            }),
        }),
        getUserPhoto: builder.query({
            query: (id) => `/user-photo/${id}`,
            providesTags: ['User'],
            keepUnusedDataFor: 1,
        }),
        getUser: builder.query({
            query: (id) => `/user/${id}`,
            providesTags: ['User'],
            keepUnusedDataFor: 1,
        }),
    })
})

export const { 
    useLoginMutation, 
    useCreateUserMutation, 
    useGetUserPhotoQuery, 
    useGetUserQuery 
} = authApi