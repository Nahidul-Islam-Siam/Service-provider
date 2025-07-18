import { BundleDiscount } from "@/interface/globalType"; // Assuming this is the correct type for the request body
import baseApi from "@/redux/api/baseApi";

// Define the API slice
const profileAbilityApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Creating a bundle discount
    createBundleDiscount: builder.mutation<{
      message: string;
 
    }, BundleDiscount>({
      query: (discountData) => ({
        url: `/bundle-discount/create`,
        method: "POST", // Using POST to create the discount
        body: discountData, // Sending the discount data in the request body
      }),
    }),
  }),
});

// Export hooks to be used in your components
export const {
  useCreateBundleDiscountMutation, // Export the createBundleDiscount mutation hook
} = profileAbilityApi;
