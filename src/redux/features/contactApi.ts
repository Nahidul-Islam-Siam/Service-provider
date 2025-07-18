/* eslint-disable @typescript-eslint/no-explicit-any */


import baseApi from "../api/baseApi";

// Define the contactApi with proper types for request and response
const contactApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Mutation for sending contact data
    postContact: builder.mutation<
      { message: string }, // Response type (adjust if your response has more properties)
      { name: string; email: string; phoneNumber: string; message: string } // Request body type
    >({
      query: (contactData) => ({
        url: "/contact/send",
        method: "POST",
        body: contactData,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const { usePostContactMutation } = contactApi;
