import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Article, ApiResponse } from '../../types';

export const articleApi = createApi({
  reducerPath: 'articleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
  }),
  tagTypes: ['Articles'],
  endpoints: (builder) => ({
    getArticles: builder.query<ApiResponse<Article[]>, { search?: string; page: number; limit: number }>({
      query: ({ search, page, limit }) => {
        const params: { [key: string]: string } = {};
        if (search) params.search = search;
        params.page = page.toString();
        params.limit = limit.toString();
        return {
          url: 'Article/getArticle',
          params,
        };
      },
      providesTags: ['Articles'],
    }),
    getArticleById: builder.query<Article, string>({
      query: (id) => ({
        url: `Article/getIdArticle/${id}`,
      }),
      providesTags: ['Articles'],
    }),
    createArticle: builder.mutation<Article, { title: string; description: string; image: File }>({
      query: ({ title, description, image }) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('image', image);

        return {
          url: 'Article/createArticle',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Articles'],
    }),
    updateArticle: builder.mutation<void, { id: string; article: { title: string; description: string; image: File } }>({
      query: ({ id, article }) => {
        const formData = new FormData();
        formData.append('title', article.title);
        formData.append('description', article.description);
        formData.append('image', article.image);

        return {
          url: `Article/updateArticle/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: ['Articles'],
    }),
    deleteArticle: builder.mutation<void, string>({
      query: (id) => ({
        url: `Article/deleteArticle/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Articles'],
    }),
    multiDeleteArticles: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: 'Article/multiDeleteArticles',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: ['Articles'],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleByIdQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useMultiDeleteArticlesMutation,
} = articleApi;