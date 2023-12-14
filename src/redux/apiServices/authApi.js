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
    })
})

export const { useLoginMutation, useCreateUserMutation } = authApi