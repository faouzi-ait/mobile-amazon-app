import { apiSlice } from "../apiBaseService/baseApiQuery";

export const apiPostListing = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
        getPosts: builder.query({
            query: (page = 1, size = 10) => `/listing-posts?page=${page}&pageSize=${size}`,
            providesTags: ['Posts'],
            keepUnusedDataFor: 1,
        }),
        getSinglePost: builder.query({
            query: (id) => `/single-post/${id}`,
            providesTags: ['Post'],
            keepUnusedDataFor: 1,
        }),
        likePost: builder.mutation({
            query: (id) => ({
              url: `/like-post/${id}`,
              method: 'POST',
            }),
            invalidatesTags: ['Post'],
        }),
        favoritePost: builder.mutation({
            query: (id) => ({
              url: `/favorite-post/${id}`,
              method: 'POST',
            }),
            invalidatesTags: ['Post'],
        }),
        userFavoritePost: builder.mutation({
            query: (id) => ({
              url: `/user-likes/${id}`,
              method: 'POST',
            }),
            invalidatesTags: ['Post'],
        }),
        viewedPost: builder.mutation({
            query: (id) => ({
              url: `/viewed-post/${id}`,
              method: 'POST',
            }),
            invalidatesTags: ['Post'],
        }),
    }),
    onError: (error /*, { dispatch, getState }*/) => {
        console.error('Global error handler:', error);
    },
})

export const { useGetPostsQuery, useGetSinglePostQuery, useGetSinglePostDataQuery, useLikePostMutation, useViewedPostMutation, useFavoritePostMutation, useUserFavoritePostMutation } = apiPostListing
