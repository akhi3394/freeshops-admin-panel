import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Use the base URL from environment variable (same as articleApi)
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const faqApi = createApi({
  reducerPath: 'faqApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}` }),
  tagTypes: ['FAQ'],
  endpoints: (builder) => ({
    // Fetch all FAQs (with pagination and search)
    getFaqs: builder.query({
      query: ({ search, page, limit }) => ({
        url: 'faq/all',
        params: { search, page, limit },
      }),
      providesTags: ['FAQ'],
    }),

    // Fetch FAQ by ID
    getFaqById: builder.query({
      query: (id) => ({
        url: `faq/get/${id}`,
        // Override base URL for this endpoint due to different port
      }),
      providesTags: ['FAQ'],
    }),

    // Update FAQ
    updateFaq: builder.mutation({
      query: ({ id, faq }) => ({
        url: `faq/update/${id}`,
        method: 'PUT',
        body: faq,
        // Override base URL for this endpoint due to different port
      }),
      invalidatesTags: ['FAQ'],
    }),

    // Delete FAQ
    deleteFaq: builder.mutation({
      query: (id) => ({
        url: `faq/delete/${id}`,
        method: 'DELETE',
        // Override base URL for this endpoint due to different port
      }),
      invalidatesTags: ['FAQ'],
    }),

    // Create FAQ
    createFaq: builder.mutation({
      query: (faq) => ({
        url: 'faq/add',
        method: 'POST',
        body: faq,
      }),
      invalidatesTags: ['FAQ'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetFaqsQuery,
  useGetFaqByIdQuery,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useCreateFaqMutation,
} = faqApi;