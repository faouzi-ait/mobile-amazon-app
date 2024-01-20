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
        updateUserPhoto: builder.mutation({
            query: (body) => ({
              url: 'update-photo',
              method: 'PUT',
              body,
            }),
            invalidatesTags: [ 'User', 'Search', 'Photo'],
        }),
        updateUserDetails: builder.mutation({
            query: (body) => ({
              url: 'user-update',
              method: 'PUT',
              body,
            }),
            invalidatesTags: [ 'User', 'Search', 'Photo'],
        }),
        getUserPhoto: builder.query({
            query: (id) => `/user-photo/${id}`,
            providesTags: ['Photo'],
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
    useUpdateUserPhotoMutation,
    useUpdateUserDetailsMutation,
    useGetUserQuery 
} = authApi