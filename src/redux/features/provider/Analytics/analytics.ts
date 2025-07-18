 // Import the correct type for user data
import baseApi from "@/redux/api/baseApi"; // Import the base API instance

// Define the API slice
const providerAnalytics = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Fetch all users from the /user/alluser endpoint
    getProviderDashboardShipmentAnalytics: builder.query({
      query: () => ({
        url: "/dashboard-analytics/shipmentTrends",
        method: "GET", 
      }),
    }),

      getProviderDashboardCards: builder.query({
      query: () => ({
        url: "/dashboard-analytics/cardAnalytics", 
        method: "GET", 
      }),
    }),




   

  }),
});

// Export hooks to be used in your components
export const {
  useGetProviderDashboardShipmentAnalyticsQuery,
  useGetProviderDashboardCardsQuery
} = providerAnalytics;
