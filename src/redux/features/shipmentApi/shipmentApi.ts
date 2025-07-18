import baseApi from "@/redux/api/baseApi";

export const shipmentApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllShipments: builder.query({
      query: (params) => ({
        url: "/service-item/getAdminShipment",
        method: "GET",
        params,
      }),
    }),
    getSingleShipment: builder.query({
      query: (shipmentID: string) => ({
        url: `/service-item/singleShipment`,
        method: "GET",
        params: {
          searchItem: shipmentID,
        },
      }),
    }),
  }),
});

export const { useGetAllShipmentsQuery, useGetSingleShipmentQuery } =
  shipmentApi;
