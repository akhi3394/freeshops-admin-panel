import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Use the base URL from environment variable (same as articleApi)
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const careerApi = createApi({
  reducerPath: 'careerApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}` }),
  tagTypes: ['Career'],
  endpoints: (builder) => ({
    // Fetch all careers (with pagination and search)
    getCareers: builder.query({
      query: ({ search, page, limit }) => ({
        url: 'Career/allCareer',
        params: { search, page, limit },
      }),
      providesTags: ['Career'],
    }),

    // Add a new career
    addCareer: builder.mutation({
      query: (career) => {
        const formData = new FormData();
        formData.append('title', career.title);
        formData.append('description', career.description);
        formData.append('image', career.image);
        return {
          url: 'Career/addCareer',
          method: 'POST',
          body: formData,
          // Override base URL for this endpoint due to different port
        };
      },
      invalidatesTags: ['Career'],
    }),

    // Update a career
    updateCareer: builder.mutation({
      query: ({ id, career }) => {
        const formData = new FormData();
        formData.append('title', career.title);
        formData.append('description', career.description);
        if (career.image) formData.append('image', career.image);
        return {
          url: `Career/updateCareer/${id}`,
          method: 'PUT',
          body: formData,
          // Override base URL for this endpoint due to different port
        };
      },
      invalidatesTags: ['Career'],
    }),

    // Delete a career
    deleteCareer: builder.mutation({
      query: (id) => ({
        url: `Career/deleteCareer/${id}`,
        method: 'DELETE',
        // Override base URL for this endpoint due to different port
      }),
      invalidatesTags: ['Career'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetCareersQuery,
  useAddCareerMutation,
  useUpdateCareerMutation,
  useDeleteCareerMutation,
} = careerApi;