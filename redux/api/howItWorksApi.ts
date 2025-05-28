import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Use the base URL from environment variable (same as articleApi)
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const howItWorksApi = createApi({
  reducerPath: 'howItWorksApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}` }),
  tagTypes: ['HowItWorks'],
  endpoints: (builder) => ({
    // Fetch all How It Works entries (with pagination and search)
    getHowItWorks: builder.query({
      query: ({ search, page, limit }) => ({
        url: 'HowItsWork/allHowItsWork',
        params: { search, page, limit },
      }),
      providesTags: ['HowItWorks'],
    }),

    // Add a new How It Works entry
    addHowItWorks: builder.mutation({
      query: (howItWorks) => {
        const formData = new FormData();
        formData.append('title', howItWorks.title);
        formData.append('description', howItWorks.description);
        formData.append('ceoLetterTitle', howItWorks.ceoLetterTitle);
        formData.append('ceoLetter', howItWorks.ceoLetter);
        formData.append('checkOutExpert', howItWorks.checkOutExpert);
        if (howItWorks.image) formData.append('image', howItWorks.image);
        if (howItWorks.bottomDataImage) formData.append('bottomDataImage', howItWorks.bottomDataImage);
        if (howItWorks.ceoLetterBackGroundImage) formData.append('ceoLetterBackGroundImage', howItWorks.ceoLetterBackGroundImage);
        if (howItWorks.checkOutExpertImage) formData.append('checkOutExpertImage', howItWorks.checkOutExpertImage);
        return {
          url: 'HowItsWork/addHowItsWork',
          method: 'POST',
          body: formData,
          // Override base URL for this endpoint due to different port
        };
      },
      invalidatesTags: ['HowItWorks'],
    }),

    // Delete a How It Works entry
    deleteHowItWorks: builder.mutation({
      query: (id) => ({
        url: `HowItsWork/deleteHowItsWork/${id}`,
        method: 'DELETE',
        // Override base URL for this endpoint due to different port
      }),
      invalidatesTags: ['HowItWorks'],
    }),

    // Placeholder for update (not provided, but included for future use)
    updateHowItWorks: builder.mutation({
      query: ({ id, howItWorks }) => ({
        url: `HowItsWork/updateHowItsWork/${id}`, // Placeholder endpoint
        method: 'PUT',
        body: howItWorks,
      }),
      invalidatesTags: ['HowItWorks'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetHowItWorksQuery,
  useAddHowItWorksMutation,
  useDeleteHowItWorksMutation,
  useUpdateHowItWorksMutation,
} = howItWorksApi;