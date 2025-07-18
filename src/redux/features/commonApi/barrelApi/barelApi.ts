import baseApi from "@/redux/api/baseApi";

// Interfaces
export interface BarrelItem {
  name: string;
  quantity: number;
  itemDescription: string;
  price: number;
}

export interface AddOrUpdateBarrelPayload {
  shipmentID: string;
  customduty: number;
  barrelList: BarrelItem[];
}

export interface GetBarrelByIdResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: {
      quantity: number;
      itemDescription: string;
      price: number;
      customduty: number;
      createdAt: string;
    }[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
  };
}

export const barrelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addBarrel: builder.mutation<
      { success: boolean; message: string },
      AddOrUpdateBarrelPayload
    >({
      query: (body) => ({
        url: "/add-barrel/add",
        method: "POST",
        body,
      }),
    }),
    // Get Barrel by Shipment ID
    getBarrelByShipmentId: builder.query<GetBarrelByIdResponse, string>({
      query: (shipmentID) => ({
        url: `/add-barrel/getallbyId?shipmentID=${shipmentID}`,
        method: "GET",
      }),
    }),
    // Update Barrel
    updateBarrel: builder.mutation<
      { success: boolean; message: string },
      { id: string; data: AddOrUpdateBarrelPayload }
    >({
      query: ({ id, data }) => ({
        url: `/add-barrel/update?id=${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useAddBarrelMutation,
  useGetBarrelByShipmentIdQuery,
  useUpdateBarrelMutation,
} = barrelApi;
