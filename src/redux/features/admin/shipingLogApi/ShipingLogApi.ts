// redux/api/logs/logApi.ts
import baseApi from "@/redux/api/baseApi";

export const logApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShipmentLogs: builder.query({
      query: ()=> ({
        url: "/user/shipmentLogs",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetShipmentLogsQuery } = logApi;
