import { TProvider } from "@/interface/globalType"; // Assuming this is the correct type for the request body
import baseApi from "@/redux/api/baseApi";

// Define the API slice
const providerApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({


    // Updating provider by id
    updateProviderAccount: builder.mutation<{
      message: string;
      data: TProvider; // Assuming the response includes the updated provider object
    }, { id: string; providerData: TProvider }>({
      query: ({ id, providerData }) => ({
        url: `/user/update?id=${id}`,
        method: "PATCH", // Using PATCH for updates, you can use PUT if needed
        body: providerData, // Sending the updated provider data in the request body
      }),
    }),
  }),
});

// Export hooks to be used in your components
export const {

  useUpdateProviderAccountMutation, // Export the updateProviderAccount mutation hook
} = providerApi;
