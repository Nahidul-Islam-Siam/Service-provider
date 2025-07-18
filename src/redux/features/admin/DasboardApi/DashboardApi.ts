// src/redux/api/dashboard/dashboardAnalyticsApi.ts
import baseApi from "@/redux/api/baseApi";

const dashboardAnalyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShipmentAnalyticsPie: builder.query<{
      data: {
        providerPerformance: {
          providerName: string;
          providerPerformance: number;
        }[];
      };
    }, void>({
      query: () => ({
        url: "/dashboard-analytics/shipmentAnalyticsPie",
        method: "GET",
      }),
    }),

    getShipmentTrends: builder.query<{
      data: {
        allShipmentTrend: {
          dailyShipmentList: number[];
          dailyIncomeList: number[];
        };
      };
    }, void>({
      query: () => ({
        url: "/dashboard-analytics/shipmentTrends",
        method: "GET",
      }),
    }),

    getCardAnalytics: builder.query<{
      data: {
        TotalShipment: number;
        activeProviders: number;
        pendingDelivery: number;
        totalRevenue: number;
      };
    }, void>({
      query: () => ({
        url: "/dashboard-analytics/cardAnalytics",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetShipmentAnalyticsPieQuery,
  useGetShipmentTrendsQuery,
  useGetCardAnalyticsQuery,
} = dashboardAnalyticsApi;
