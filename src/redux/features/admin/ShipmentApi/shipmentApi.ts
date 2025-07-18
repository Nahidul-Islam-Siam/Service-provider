
/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from "@/redux/api/baseApi";

export interface Shipments {
  id: string;
  shipmentID: string;
  userID: string;
  rating: number;
  title: string;
  comment: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ShipmentReview {
  success: boolean;
  statusCode: number;
  message: string;
  data: Shipments[];
}

export const shipmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShipment: builder.query<ShipmentReview, void>({
      query: () => ({
        url: "/service-item/getAdminShipment?page=1&limit=4&status",
        method: "GET",
      }),
    }),

    
  }),
});

export const {
  useGetShipmentQuery,

} = shipmentApi;
