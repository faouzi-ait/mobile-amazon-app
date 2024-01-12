import { apiSlice } from "../apiBaseService/baseApiQuery";

export const apiPostListing = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
        getPosts: builder.query({
            query: ({ searchTerm, page, pageSize }) => {
              const queryParams = new URLSearchParams({ q: searchTerm, page, pageSize });
              return `/listing-posts?${queryParams.toString()}`;
            },
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


        createPost: builder.mutation({
            query: (body) => ({
                url: '/new-post',
                method: 'POST',
                body,
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
        createReview: builder.mutation({
            query: (body) => ({
              url: '/reviews',
              method: 'PUT',
              body,
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

export const { useGetPostsQuery, useGetSinglePostQuery, /*useGetSearchPostsQuery,*/ useGetSinglePostDataQuery,  useCreatePostMutation, useCreateReviewMutation, useLikePostMutation, useViewedPostMutation, useFavoritePostMutation, useUserFavoritePostMutation } = apiPostListing
