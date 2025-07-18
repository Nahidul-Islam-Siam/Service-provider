import baseApi from "@/redux/api/baseApi";

export const trackMyShipmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrackMyShipment: builder.query({
      query: (searchItem: string) => ({
        url: `/service-item/singleShipment?searchItem=${searchItem}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetTrackMyShipmentQuery } = trackMyShipmentApi;

