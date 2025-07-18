import baseApi from "@/redux/api/baseApi";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentCard: builder.query({
      query: () => ({
        url: "/dashboard-analytics/paymentAnalytics",
        method: "GET",
      }),
    }),
    getPaymentHistory: builder.query({
      query: () => ({
        url: "/dashboard-analytics/paymentHistory",
        method: "GET",
      }),
    }),
    getUpcomingPayments: builder.query({
      query: () => ({
        url: "/dashboard-analytics/upcomingPayout",
        method: "GET",
      }),
    }),
  }),
});


export const {
  useGetPaymentCardQuery,
  useGetPaymentHistoryQuery,
  useGetUpcomingPaymentsQuery,
} = paymentApi;