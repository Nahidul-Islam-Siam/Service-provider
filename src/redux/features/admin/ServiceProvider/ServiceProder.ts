/* eslint-disable @typescript-eslint/no-explicit-any */

import { TServiceProvider } from "@/interface/globalType"; // Assuming this is the correct type for the request body
import baseApi from "@/redux/api/baseApi";

// Define the API slice
const serviceProviderApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Creating provider type (service type)
    postServiceTypes: builder.mutation<{ message: string }, TServiceProvider>({
      query: (providerData) => ({
        url: "/service-provider/create/provider-type", // Endpoint for creating provider type
        method: "POST",
        body: providerData, // Sending provider data in the body
      }),
    }),

    // Fetching all provider types
    getProviderTypes: builder.query<{
      message: string;
      data: TServiceProvider[];
    }, void>({
      query: () => ({
        url: "/service-provider/get/provider-type",
        method: "GET",
      }),
    }),

    // Deleting a provider type
    deleteProviderType: builder.mutation<{ message: string }, string>({
      query: (providerId) => ({
        url: `/service-provider/delete/provider-type/${providerId}`,
        method: "DELETE",
      }),
    }),
  deleteProviderService: builder.mutation<{ message: string }, string>({
      query: (providerId) => ({
        url: `/service-provider/delete/service-provider/${providerId}`,
        method: "DELETE",
      }),
    }),

    // Updating a provider type
    updateProviderType: builder.mutation<{
      message: string;
    }, { id: string; providerData: TServiceProvider }>({
      query: ({ id, providerData }) => ({
        url: `/service-provider/update/provider-type/${id}`,
        method: "PUT",
        body: providerData, // Sending the updated provider data
      }),
    }),

    // Fetching all service providers
    getServiceProviders: builder.query<{
      message: string;
      data: TServiceProvider[];
    }, void>({
      query: () => ({
        url: "/service-provider/get/service-provider", // The endpoint to fetch service providers
        method: "GET",
      }),
    }),

    // Deleting a service provider
    deleteProvider: builder.mutation<{ message: string }, string>({
      query: (providerId) => ({
        url: `/service-provider/delete/${providerId}`, // Dynamic providerId
        method: "DELETE",
      }),
    }),

    // Creating a new service provider
    createService: builder.mutation<{ message: string }, TServiceProvider>({
      query: (providerData) => ({
        url: "/service-provider/create/provider-service", // The endpoint to create a service provider
        method: "POST",
        body: providerData, // Sending the service provider data in the body
      }),
    }),

    registerProvider: builder.mutation({
      query: (body: {
        idToken: string;
        refreshToken?: string;
        role?: string;
        name?: string;
        phoneNumber?: string;
        providerService?: string;
        providerType?: string;
      }) => ({
        url: "/auth/register/sProvider",
        method: "POST",
        body,
      }),
    }),

    getProvider: builder.query<{
      message: string;
      data: TServiceProvider[];
    }, void>({
      query: () => ({
        url: "/available-service/getall",
        method: "GET",
      }),
    }),
  }),
});

// Export hooks to be used in your components
export const {
  usePostServiceTypesMutation,
  useGetProviderTypesQuery,
  useDeleteProviderTypeMutation,
  useUpdateProviderTypeMutation,
  useGetServiceProvidersQuery,
  useDeleteProviderMutation, // Keep only one delete mutation
  useCreateServiceMutation,
  useRegisterProviderMutation,
  useGetProviderQuery, // Export the getProvider query hook
  useDeleteProviderServiceMutation, // Export the deleteProviderService mutation hook
} = serviceProviderApi;
