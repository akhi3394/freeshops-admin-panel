import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const autoDealershipApi = createApi({
  reducerPath: 'autoDealershipApi',
  baseQuery: fetchBaseQuery({ baseUrl:  `${process.env.NEXT_PUBLIC_API_BASE_URL}`, }),
  tagTypes: ['AutoDealership'],
  endpoints: (builder) => ({
    // Fetch all auto dealerships (with pagination and search)
    getAutoDealerships: builder.query({
      query: ({ search, page, limit }) => ({
        url: 'AutoDealerShip/allAutoDealerShip',
        params: { search, page, limit },
      }),
      providesTags: ['AutoDealership'],
    }),

    // Add a new auto dealership
    addAutoDealership: builder.mutation({
      query: (dealership) => {
        const formData = new FormData();
        formData.append('name', dealership.name);
        formData.append('description', dealership.description);
        formData.append('image', dealership.image);
        return {
          url: 'AutoDealerShip/addDataInData',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['AutoDealership'],
    }),

    // Delete an auto dealership
    deleteAutoDealership: builder.mutation({
      query: (id) => ({
        url: `AutoDealerShip/deleteAutoDealerShip/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AutoDealership'],
    }),

    // Placeholder for update (not provided in the request, but included for future use)
    updateAutoDealership: builder.mutation({
      query: ({ id, dealership }) => ({
        url: `AutoDealerShip/updateAutoDealership/${id}`, // Placeholder endpoint
        method: 'PUT',
        body: dealership,
      }),
      invalidatesTags: ['AutoDealership'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetAutoDealershipsQuery,
  useAddAutoDealershipMutation,
  useDeleteAutoDealershipMutation,
  useUpdateAutoDealershipMutation,
} = autoDealershipApi;